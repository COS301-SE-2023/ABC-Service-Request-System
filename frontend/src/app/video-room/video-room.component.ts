import { Component, OnInit } from '@angular/core';
import Peer from 'peerjs';

@Component({
  selector: 'app-video-room',
  templateUrl: './video-room.component.html',
  styleUrls: ['./video-room.component.scss']
})
export class VideoRoomComponent implements OnInit {

  private peer!: Peer;
  private lazyStream: any;
  private peerList: Array<any> = [];

  peerIdShare!: string;
  peerId!: string;
  currentPeer: any;

  constructor(){
    this.peer = new Peer
  }

  ngOnInit(): void {
    this.setupPeerConnection();
    this.getPeerId();
  }

  getPeerId = () => {
    this.peer.on('open', (id) => {
      this.peerId = id;
    })

    this.peer.on('call', (call) => {
      const isAccepted = confirm("Incoming call. Do you want to accept?");

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

    })
  }

  setupPeerConnection(): void {
    // Listen for incoming data connections (for declined messages)
    this.peer.on('connection', (connection) => {
      connection.on('data', (data) => {
        // Handle the declined message, e.g., show an alert to the sender
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
      call.on('stream', (remoteStream) => {
        if(!this.peerList.includes(call.peer)){
          this.streamRemoteVideo(remoteStream);
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

    document.getElementById('remote-video')?.append(video);
  }

  screenShare(): void {
    this.shareScreen();
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

      const sender = this.currentPeer.getSenders().find((s:any) => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }).catch(err => {
      console.log('Unable to get display media ' + err);
    });
  }

  private stopScreenShare() {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    const sender = this.currentPeer.getSenders().find((s:any) => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
  }
}
