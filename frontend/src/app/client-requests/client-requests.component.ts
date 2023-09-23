import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/services/client.service';
import { NavbarService } from 'src/services/navbar.service';
import { client } from '../../../../backend/clients/src/models/client.model';
import { group } from '../../../../backend/clients/src/models/group.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { GroupService } from 'src/services/group.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-client-requests',
  templateUrl: './client-requests.component.html',
  styleUrls: ['./client-requests.component.scss']
})
export class ClientRequestsComponent implements OnInit {

  constructor(private navbarService: NavbarService,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private groupService: GroupService,
    private userService: UserService) {}

  navbarIsCollapsed!: boolean;
  clientRequests: client[] = [];

  isAddTodoOverlayOpened = false;
  todo: FormControl = new FormControl();

  selectedTodoIndex!: string;

  clientTodoArrays: any[][] = [];

  callingClients: client[] = [];

  outerIndex!: number;
  innerIndex!: number;

  getCallingClients() {
    this.clientService.getCallingClientsQuick().subscribe(
      (data) => {
        this.callingClients = data;
      },
      (err) => {
        console.error('Error fetching calling clients', err);
      }
    )

    this.clientService.getCallingClients().subscribe(
      (data) => {
        this.callingClients = data;
      },
      (err) => {
        console.error('Error fetching calling clients', err);
      }
    )
  }

  ngOnInit(): void {
    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
    });

    this.getCallingClients();

    this.clientService.getAllClientsWithAllRequests().subscribe(
      (res: client[]) => {
        this.clientRequests = res;

        this.clientRequests.forEach(client => {
          client.requests = client.requests.filter(request => {
            return request.status === 'Pending';
          });
        })

        this.clientRequests = this.clientRequests.filter(client => {
          if(client.requests.length !== 0) {
            this.clientTodoArrays.push([]);
          }
          return client.requests.length !== 0;
        });

        console.log('cli', this.clientRequests);
      },
      (err) => {
        console.log("error fetching client requests: ", err);
      }
    )
  }

  approveRequest(client: client, requestId: string, requestedProjectName: string){
    const possibleLogos = [
      {logo: "../../assets/project-logos/camera.png", color: "orange-cl"},
      {logo: "../../assets/project-logos/coffee-cup.png", color: "cyan-cl"},
      {logo: "../../assets/project-logos/computer.png", color: "yellow-cl"},
      {logo: "../../assets/project-logos/eight.png", color: "grey-cl"},
      {logo: "../../assets/project-logos/flask.png", color: "purple-cl"},
      {logo: "../../assets/project-logos/hotdog.png", color: "green-cl"},
      {logo: "../../assets/project-logos/laptop.png", color: "blue-cl"},
      {logo: "../../assets/project-logos/notebook.png", color: "pink-cl"},
      {logo: "../../assets/project-logos/smartphone.png", color: "yellow-cl"},
      {logo: "../../assets/project-logos/vynil.png", color: "orange-cl"},
      {logo: "../../assets/project-logos/wallet.png", color: "cyan-cl"},
      {logo: "../../assets/project-logos/web-design.png", color: "purple-cl"},
    ]

    const randomIndex = Math.floor(Math.random() * possibleLogos.length);
    const selectedLogo = possibleLogos[randomIndex];

    const groups: group[] = [];

    const dataToSend = {
      clientId: client.id,
      projectName: requestedProjectName,
      logo: selectedLogo.logo,
      color: selectedLogo.color,
      groups: groups
    }

    this.clientService.addProject(dataToSend).subscribe(
      (response: client) => {
        console.log('project added to client: ', response);

        this.clientService.updateRequest(client.id, requestId, 'Approved').subscribe(
          (response) => {
            console.log('request status updated to: ', response);
            const clientToRemove: client = this.clientRequests.find((c) => c.id === client.id)!;

            if(clientToRemove){
              const request = clientToRemove.requests.find((r) => r.id === requestId);
              const index = clientToRemove.requests.indexOf(request!);
              if (index !== -1) {
                clientToRemove.requests.splice(index, 1);
              }
            }

            this.openSnackBar("Request Accepted", "OK");
          },
          (error) => {
            console.log('error when updating status: ', error);
          }
        );
      },
      (err) => {
        console.log('error adding project to client: ', err);
      }
    )
  }

  rejectRequest(client: client, requestId: string) {
    this.clientService.updateRequest(client.id, requestId, 'Rejected').subscribe(
      (response) => {
        console.log('request status updated to: ', response);

        const clientToRemove: client = this.clientRequests.find((c) => c.id === client.id)!;

        if(clientToRemove){
          const clientToRemove: client = this.clientRequests.find((c) => c.id === client.id)!;
          if(clientToRemove){
            const request = clientToRemove.requests.find((r) => r.id === requestId);
            const index = clientToRemove.requests.indexOf(request!);
            if (index !== -1) {
              clientToRemove.requests.splice(index, 1);
            }
          }
        }

        this.openSnackBar("Request Rejected", "OK");
      },
      (error) => {
        console.log('error when updating status: ', error);
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }

  joinCall(roomId: string) {
    const url = environment.CLIENT_ROOM + roomId + `?roomId=${roomId}`;
    window.open(url, '_blank');
  }

  // addTodo() {
  //   if(!this.clientTodoArrays[this.innerIndex]) {
  //     this.clientTodoArrays[this.innerIndex] = [];
  //   }

  //   if(!this.clientTodoArrays[this.innerIndex][this.outerIndex]){
  //     this.clientTodoArrays[this.innerIndex][this.outerIndex] = [];
  //   }

  //   this.clientTodoArrays[this.innerIndex][this.outerIndex].push(this.todo.value);

  //   console.log("Todo Value: ", this.todo.value);
  //   console.log("arrays: ", this.clientTodoArrays);

  //   this.todo.reset();
  //   this.toggleAddTodoOverlay(this.innerIndex, this.outerIndex);
  // }

  // toggleAddTodoOverlay(innerIndex: number, outerIndex: number){
  //   this.innerIndex = innerIndex;
  //   this.outerIndex = outerIndex;
  //   console.log('selected index: ', this.innerIndex, ' ', this.outerIndex);
  //   this.isAddTodoOverlayOpened = !this.isAddTodoOverlayOpened;
  // }


}
