import { Component, OnInit, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import Peer, { MediaConnection } from 'peerjs';
import { ClientService } from 'src/services/client.service';
import { client } from '../../../../backend/clients/src/models/client.model';
import { AuthService } from 'src/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-video-room',
  templateUrl: './video-room.component.html',
  styleUrls: ['./video-room.component.scss']
})
export class VideoRoomComponent implements OnInit, OnDestroy {

  loggedInClient$!: Observable<client>;
  loggedInClientObject!: client;

  private peer!: Peer;
  public lazyStream: any;
  private localStream: any;
  private peerList: Array<any> = [];

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    this.endCall();
  }

  peerIdShare!: string;
  peerId!: string;
  currentPeer: any;

  mediaConnection!: MediaConnection;

  isConnectionClosed = false;

  sharingScreen = false;

  constructor(private elementRef: ElementRef,
              private clientService: ClientService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router){
    this.peer = new Peer;
    this.getClient();
  }

  getClient() {
    this.loggedInClient$ = this.authService.getLoggedInClient();

    this.loggedInClient$.subscribe((loggedInClient) => {
      this.loggedInClientObject = loggedInClient;

      if(!loggedInClient)
        return;

      this.clientService.getClientById(loggedInClient.id).subscribe(
        (res) => {
          this.loggedInClientObject = res;
        },
        (err) => {
          console.log('an error occured when trying to get client', err);
        }
      )
    });
  }

  ngOnInit(): void {
    this.setupPeerConnection();
    this.getPeerId();
    this.startLocalStream();

    if(!this.loggedInClientObject) {
      const currentRoomId = this.route.snapshot.paramMap.get('roomId');

      if (currentRoomId) {
        this.callPeer(currentRoomId);
      }
      // this.callPeer()
    } else {
      console.log(this.loggedInClientObject);
    }
  }

  ngOnDestroy(): void {
    this.endCall();

    if(this.mediaConnection){
      this.mediaConnection.close();
      this.sendCallEndedMessage(this.mediaConnection.peer);
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach((track: any) => track.stop());
    }

    if (this.lazyStream) {
      this.lazyStream.getTracks().forEach((track: any) => track.stop());
    }

    if (this.peer) {
      this.peer.destroy();
    }
  }

  startLocalStream(): void {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then((stream) => {
      this.localStream = stream; // Store the local stream
      const localVideo = document.getElementById('local-video') as HTMLVideoElement;
      localVideo.srcObject = stream;
    }).catch(err => {
      console.log("Unable to access local media: ", err);
    });
  }

  getPeerId = () => {
    this.peer.on('open', (id) => {
      this.peerId = id;
      if (this.loggedInClientObject){
        this.clientService.setChatId(this.loggedInClientObject.id, id).subscribe(
          (res) => {
            console.log(res);
          },
          (err) => {
            console.log('error', err);
          }
        );
      }
    });

    this.peer.on('call', (call) => {
      const isAccepted = confirm("Incoming call. Do you want to accept?");

      this.mediaConnection = call;

      if(isAccepted){
        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        }).then((stream) => {
          this.lazyStream = stream;

          call.answer(stream);
          call.on('stream', (remoteStream) => {
            if(!this.peerList.includes(call.peer)){
              this.streamRemoteVideo(remoteStream);
              this.currentPeer = call.peerConnection;
              this.peerList.push(call.peer);
            }
          });

        }).catch(err => {
          console.log("Unable to connect: ", err);
        });
      } else {
        // If declined, reject the call
        alert('call was closed');
        call.close();
        const declinedMessage = `Call to ${call.peer} was declined.`;
        this.sendDeclinedMessage(call.peer, declinedMessage);
      }

      call.on('close', () => {
        // alert(`Call with ${call.peer} has ended.`);
        // Notify the user here that the call has ended
      });

    })
  }

  setupPeerConnection(): void {
    // Listen for incoming data connections (for declined messages)
    this.peer.on('connection', (connection) => {
      connection.on('data', (data) => {
        // Handle the declined message, e.g., show an alert to the sender

        if(data == 'Call ended'){
          this.isConnectionClosed = true;
          if (this.loggedInClientObject) {
            this.clientService.resetCallingClient(this.loggedInClientObject.id).subscribe(
              (res) => {
                console.log(res);
              }, (err) => {
                console.log(err);
              }
            )
          }
        }else
          alert(data);
      });
    });
  }

  sendDeclinedMessage(callerPeerId: string, message: string) {
    const connection = this.peer.connect(callerPeerId);
    connection.on('open', () => {
      connection.send(message);
    });
  }

  connectWithPeer(): void {
    this.callPeer(this.peerIdShare);
  }

  callPeer(id: string): void {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then((stream) => {
      this.lazyStream = stream;

      const call = this.peer.call(id, stream);

      this.mediaConnection = call;

      call.on('stream', (remoteStream) => {
        if(!this.peerList.includes(call.peer)){
          this.streamRemoteVideo(remoteStream);
          this.streamLocalVideo(this.localStream);
          this.currentPeer = call.peerConnection;
          this.peerList.push(call.peer);
        }
      });
    }).catch(err => {
      console.log("Unable to connect: ", err);
    })
  }

  streamRemoteVideo(stream: any): void {
    const video = document.createElement('video');
    video.classList.add('video');
    video.srcObject = stream;
    video.play();

    // video.classList.add('flipped-video');
    // video.style.transform = 'scaleX(-1)';
    video.style.width = '100%';
    video.style.objectFit = 'cover';
    video.style.borderRadius = '0.7em';


    document.getElementById('remote-video')?.append(video);
  }

  streamLocalVideo(stream: any): void {
    const localVideo = document.getElementById('local-video') as HTMLVideoElement;
    localVideo.srcObject = stream;
  }

  screenShare(): void {
    const shareButton = document.querySelector('#shareButton');
    const shareIcon = shareButton?.querySelector('img');

    if(!this.sharingScreen) {
      this.shareScreen();
      this.sharingScreen = true;
      if(shareIcon)
        shareIcon.src = '../../assets/share-video.png';
    } else {
      this.stopScreenShare();
      this.sharingScreen = false;
      if(shareIcon)
        shareIcon.src = '../../assets/share-video-off.png';
    }
  }

  toggleCamera() {
    const videoTracks = this.localStream.getVideoTracks();

    if (videoTracks.length === 0) {
      return;
    }

    videoTracks[0].enabled = !videoTracks[0].enabled;

    const cameraButton = document.querySelector('.button');
    const cameraIcon = cameraButton?.querySelector('img');

    if(cameraIcon) {
      if (videoTracks[0].enabled) {
        cameraIcon.src = '../../assets/video-camera.png';
        this.replaceVideoTrack(this.localStream, this.lazyStream.getVideoTracks()[0]);
      } else {
        cameraIcon.src = '../../assets/video-camera-off.png';
        if(!this.sharingScreen)
          this.replaceVideoTrack(this.localStream, this.createBlackVideoTrack());
      }
    }
  }

  replaceVideoTrack(stream: any, newTrack: any) {
    const videoSender = this.currentPeer.getSenders().find((sender: any) => sender.track.kind === 'video');
    videoSender.replaceTrack(newTrack);
  }

  createBlackVideoTrack() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 480;
    ctx!.fillStyle = 'black';
    ctx!.fillRect(0, 0, canvas.width, canvas.height);
    const stream = canvas.captureStream();
    return stream.getVideoTracks()[0];
  }

  private shareScreen() {
    navigator.mediaDevices.getDisplayMedia({
      video: {
        // cursor: 'always'
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    }).then(stream => {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      const localVideo = document.getElementById('local-video') as HTMLVideoElement;
      localVideo.srcObject = stream;

      const sender = this.currentPeer.getSenders().find((s:any) => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }).catch(err => {
      console.log('Unable to get display media ' + err);
    });
  }

  private stopScreenShare() {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    if(this.currentPeer) {
      const sender = this.currentPeer.getSenders().find((s:any) => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }
    this.startLocalStream();
  }

  endCall() {
    if(this.loggedInClientObject) {
      this.clientService.resetCallingClient(this.loggedInClientObject.id).subscribe(
        (res) => {
          console.log('res', res);

          if(this.mediaConnection){
            this.mediaConnection.close();
            this.sendCallEndedMessage(this.mediaConnection.peer);
          } else {
            setTimeout(() => {
              console.log('client left')
              this.router.navigate(['/client-dashboard']);
              // window.location.href = environment.FRONTEND_CLIENT_DASHBOARD_URL;
            }, 200);
          }
        },
        (err) => {
          console.log('error resetting client chatID', err);
        }
      )
    } else {
      this.mediaConnection.close();
      this.sendCallEndedMessage(this.mediaConnection.peer);
      setTimeout(() => {
        window.close();
      }, 500);
    }
  }

  sendCallEndedMessage(callerPeerId: string) {
    // alert('peer id is: ' + callerPeerId);
    const connection = this.peer.connect(callerPeerId);
    connection.on('open', () => {
      connection.send('Call ended');

      if(this.loggedInClientObject)
        setTimeout(() => {
          // this.router.navigate(['/client-dashboard']);
          window.location.href = environment.FRONTEND_CLIENT_DASHBOARD_URL;
        }, 200);
    });
  }

  navigateOut() {
    if(this.loggedInClientObject) {
      console.log('I went out as a client');
      this.router.navigate(['/client-dashboard']);
    }
      // window.location.href = environment.FRONTEND_CLIENT_DASHBOARD_URL;
    else
      window.close();
  }
}
