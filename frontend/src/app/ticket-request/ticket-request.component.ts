import { Component, Input, OnInit } from '@angular/core';
import { client, request } from '../../../../backend/clients/src/models/client.model';
import { group } from '../../../../backend/clients/src/models/group.model';
import { GroupService } from 'src/services/group.service';
import { UserService } from 'src/services/user.service';
import { user } from '../../../../backend/users/src/models/user.model';
import { AuthService } from 'src/services/auth.service';
import { TicketsService } from 'src/services/ticket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService } from 'src/services/client.service';

@Component({
  selector: 'app-ticket-request',
  templateUrl: './ticket-request.component.html',
  styleUrls: ['./ticket-request.component.scss']
})
export class TicketRequestComponent implements OnInit {
  @Input() clientRequest!: client;
  @Input() request!: request;

  allGroups: group [] = [];

  assignableUsers: user[] = [];

  selectedAssignedUser!: user;
  currentUserObject!: user;

  constructor (private groupService: GroupService, private userService: UserService, private authService: AuthService, private ticketService: TicketsService, private snackBar: MatSnackBar, private clientService: ClientService) {}

  ngOnInit(): void {
    this.getAllGroups();
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.getUserObject().subscribe(
      (res) => {
        this.currentUserObject = res;
      }, (err) => {
        console.log('error getting current user: ', err);
      }
    )
  }

  stripPTags(content: string): string {
    return content.replace(/<\/?p>/g, '');
  }

  approveTicketRequest(project: string, summary: string, description: string, priority: string, group: string, assigned: user){
    const assignee = this.currentUserObject.emailAddress;
    const assignedEmail = assigned.emailAddress;
    const currentDate = new Date();
    const endDate = '22/09/2023';
    const startDate = this.formatDate(this.stringFormatDate(currentDate));
    const status = "Active";
    const comments: string [] = [];
    const todoArray: string[] = [];
    const todoChecked: boolean[] = [];

    const trimmedDescription = this.stripPTags(description);

    let groupName = "";

    this.groupService.getGroupById(group).subscribe((response: group) => {
      groupName = response.groupName;

      this.ticketService.addTicket(summary, trimmedDescription, assignee, assignedEmail, groupName, priority, startDate, endDate, status, comments, project, todoArray, todoChecked).subscribe((response: any) => {
        const newTicketId = response.newTicketID;
        console.log(response);

        this.groupService.updateTicketsinGroup(group, newTicketId).subscribe((response: any) => {
          console.log('group res', response);

          this.clientService.updateRequest(this.clientRequest.id, this.request.id, 'Approved').subscribe(
            (response) => {
              console.log('request status updated to: ', response);
              this.openSnackBar("Request Accepted", "OK");
            },
            (error) => {
              console.log('error when updating status: ', error);
            }
          );
        });
      });
    });
  }

  rejectRequest(clientRequest: client, requestId: string) {
    console.log('rejected');
  }

  getAllGroups() {
    this.groupService.getGroups().subscribe(
      (res) => {
        console.log('groups got: ', res);
        this.allGroups = res;
        this.updateAssignedUserOptions(this.allGroups[0].id);
      }, (err) => {
        console.log('error getting all groups: ', err);
      }
    )
  }

  onGroupChanged(event: Event) {
    const groupSelectedId = (event.target as HTMLSelectElement).value;
    this.updateAssignedUserOptions(groupSelectedId);
  }

  updateAssignedUserOptions(groupId: string) {
    this.userService.getUsersByGroupId(groupId).subscribe(
      (res) => {
        this.assignableUsers = res;
        this.selectedAssignedUser = this.assignableUsers[0];
      }, (err) => {
        console.log('error assigning users: ', err);
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }

  private formatDate(date: string): string {
    const parts = date.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    return formattedDate;
  }

  private stringFormatDate(date: Date): string {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }

    if ( day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
