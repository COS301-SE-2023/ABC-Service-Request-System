import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
// import { tickets } from '../data';
import { TicketsService } from 'src/services/ticket.service';
import { ticket } from "../../../../backend/tickets/src/models/ticket.model";
import { Router } from '@angular/router';
import { user } from '../../../../backend/users/src/models/user.model';
import { Sort } from '@angular/material/sort';
import { tick } from '@angular/core/testing';
import { AuthService } from 'src/services/auth.service';
import { GroupService } from 'src/services/group.service';
import { group } from '../../../../backend/groups/src/models/group.model';
import { ClientService } from 'src/services/client.service';
import { project } from '../../../../backend/clients/src/models/client.model';

@Component({
  selector: 'app-ticket-table',
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss']
})

export class TicketTableComponent implements OnInit{
  constructor(private ticketService: TicketsService, private router: Router, private authservice: AuthService, private groupService: GroupService, private clientService: ClientService) { }

  allTicketsArray: ticket[] = [];
  sortedTicketsArray: ticket[] = [];
  currentUserGroups: string[] = [];
  selectedProject!: project;

  assigneeDetails!: user[];
  assignedDetails!: user[];

  @Input() tickets: any[] = [];
  @Output() openForm = new EventEmitter<string>();

  openUpdateForm(oldAssignee: string){
    this.openForm.emit(oldAssignee);
  }

  getClientGroups(){
    const user = this.authservice.getUser();

    user.groups.forEach(group => {
      this.groupService.getGroupNameById(group).subscribe(
        (response) => {
          const groupName = response.groupName;
          if(!this.currentUserGroups.includes(groupName))
            this.currentUserGroups.push(groupName);
        }, (error) => {
          console.log("Error fetching group names", error);
        }
      )
    })

  }

  getTicketsForTable(){
    const projectsObservable = this.clientService.getProjectsObservable();
    if (projectsObservable !== undefined) {
      projectsObservable.subscribe((project) => {
        if (project !== undefined) {
          this.selectedProject = project;
          console.log(this.selectedProject, ' pr selected');

          this.ticketService.getAllTickets().subscribe((response: ticket[]) => {
            console.log('important: ', response);
            this.allTicketsArray = response.filter((ticket: ticket) => {
              // this.authservice.getUserNameByEmail(ticket.assigned).subscribe((response) => {
              //   this.assignedDetails.push(response);
              // });

              // this.authservice.getUserNameByEmail(ticket.assignee).subscribe((response) => {
              //   this.assigneeDetails.push(response);
              // });

              return (this.currentUserGroups.includes(ticket.group) && ticket.project === this.selectedProject.name);
            })

            console.log("current user groups: ", this.currentUserGroups);
            console.log("after filter", this.allTicketsArray);

            // for (let i = 0; i < this.allTicketsArray.length; i++) {
            //   const assigneeNames = this.assigneeDetails[i].name + " " + this.assigneeDetails[i].surname;
            //   const assignedNames = this.assignedDetails[i].name + " " + this.assignedDetails[i].surname;

            //   this.allTicketsArray[i].assignee = assigneeNames;
            //   this.allTicketsArray[i].assigned = assignedNames;
            // }

            this.allTicketsArray = this.sortTickets(this.allTicketsArray);
            this.sortedTicketsArray = this.allTicketsArray.slice();
          });
        }
      });
    }
  }

  ngOnInit(): void {
      this.getClientGroups();
      this.getTicketsForTable();

      // this.assignedDetails.length = 0;
      // this.assigneeDetails.length = 0;
  }

  navigateToTicket(id: string) {
    this.router.navigate([`/ticket/${id}`]);
  }

  sortData(sort: Sort){
    const data = this.sortedTicketsArray.slice();
    if(!sort.active || sort.direction === ''){
      this.sortedTicketsArray = data;
      return;
    }

    this.sortedTicketsArray = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compare(a.id, b.id, isAsc);
        case 'summary':
          return this.compare(a.summary, b.summary, isAsc);
        case 'assignee':
          return this.compare(a.assignee, b.assignee, isAsc);
        case 'assigned':
          return this.compare(a.assigned, b.assigned, isAsc);
        case 'group':
          return this.compare(a.group, b.group, isAsc);
        case 'priority':
          return this.comparePriority(a.priority, b.priority, isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        case 'created':
          return this.compareDates(a.startDate, b.startDate, isAsc);
        case 'deadline':
          return this.compareDates(a.endDate, b.endDate, isAsc);
        default:
          return 0
      }
    })
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  comparePriority(a: string, b: string, isAsc: boolean) {
    const priorityOrder = ["LOW", "MEDIUM", "HIGH"];
    const aIndex = priorityOrder.indexOf(a.toUpperCase());
    const bIndex = priorityOrder.indexOf(b.toUpperCase());

    if (isAsc) {
      return aIndex - bIndex;
    } else {
      return bIndex - aIndex;
    }
  }

  compareDates(a: string, b: string, isAsc: boolean) {
    const dateA = this.getDateFromFormat(a);
    const dateB = this.getDateFromFormat(b);

    if (dateA < dateB) {
      return isAsc ? -1 : 1;
    } else if (dateA > dateB) {
      return isAsc ? 1 : -1;
    } else {
      return 0;
    }
  }

  getDateFromFormat(date: string) {
    const parts = date.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is zero-based in JavaScript Date
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['tickets']) {
      this.sortedTicketsArray = this.sortTickets(changes['tickets'].currentValue);
    }
  }

  sortTickets(tickets: ticket[]): ticket[] {
    console.log(tickets);
    return tickets;
  }

  getAssigneeName(email: string) {
    this.authservice.getUserNameByEmail(email).subscribe((response: user) => {
      return response.name;
    });
  }

  getAssignedName(email: string) {
    this.authservice.getUserNameByEmail(email).subscribe((response: user) => {
      return response.name;
    });
  }
}

