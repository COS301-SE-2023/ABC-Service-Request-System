import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { group } from '../../../../backend/src/models/group.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { TicketsService } from 'src/services/ticket.service';
import { GroupService } from 'src/services/group.service';
import { UserService } from 'src/services/user.service';
import { user } from '../../../../backend/src/models/user.model';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements OnInit {
  groupId!: string;
  groupName!: string;
  users: user[] = [];
  filterValue = 'personal';
  groups: group[] = [];
  selectedGroup!: group;


  overdueTicketsCount = 0;

  constructor(private router: Router, public authService: AuthService,
    private groupService: GroupService, private ticketsService: TicketsService, private userService: UserService,
    private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('in analytics page');
  
    const userId = this.authService.getUser().id;
    const userGroups: any [] = this.authService.getUser().groups;

    for(let i = 0; i < userGroups.length; i++){
      this.groupService.getGroupsByUserId(userGroups[i]).subscribe(
        (response) => {
          this.groups.push(response);
          //this.groups = response;
          // Handle the groups data
          console.log(this.groups);
        },
        (error) => {
          console.error(error);
          // Handle the error
        }
      );
    
    }

    // this.groupService.getGroupsByUserId(userId).subscribe(
    //   (response) => {
    //     this.groups = response;
    //     // Handle the groups data
    //     console.log(this.groups);
    //   },
    //   (error) => {
    //     console.error(error);
    //     // Handle the error
    //   }
    // );
  }

  onGroupSelected(groupId: string): void {
    this.groupId = groupId;
    this.groupService.getUsersByGroupId(groupId).subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.log(error);
      }
    );

    this.groupService.getGroupNameById(groupId).subscribe(
      (response) => {
        console.log(response);
        console.log(response);
        console.log(typeof response); // check the type of response
        // this.groupName = response.groupName;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //update
  handleFilterChange(filterValue: string): void {
    this.users = [];

    if (filterValue === 'personal') {
      this.filterValue = filterValue;
      this.userService.getAllUsers().subscribe(
        (response) => {
          this.users = response;
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (filterValue === 'group') {
      this.filterValue = filterValue;
      this.users = [];
    }
  }

  selectGroup(group: group): void {
    this.selectedGroup = group;
    this.onGroupSelected(group.id);
  }

  // async checkPendingTickets() {
  //   try {
  //     const userId = "2"; // Replace with the actual user ID
  //     const pendingTickets = await this.ticketsService.getPendingTickets(userId);
  //     console.log("Total pending tickets:", pendingTickets);
  //   } catch (error) {
  //     console.error("Error retrieving pending tickets:", error);
  //   }
  // }

  // getPersonalOverdueTickets(userId: string): void {
  //   this.ticketService.getTicketsByUserId(userId).subscribe(
  //     (tickets: any[]) => {
  //       const overdueTickets = tickets.filter(ticket => new Date(ticket.endDate) < new Date());
  //       console.log(overdueTickets);
  //     },
  //     (error: any) => {
  //       console.error(error);
  //     }
  //   );
  // }
  
  // getGroupOverdueTickets(groupId: string): void {
  //   this.ticketService.getTicketsByGroupId(groupId).subscribe(
  //     (tickets: any[]) => {
  //       const overdueTickets = tickets.filter((ticket: { endDate: string | number | Date; }) => new Date(ticket.endDate) < new Date());
  //       console.log(overdueTickets);
  //     },
  //     (error: any) => {
  //       console.error(error);
  //     }
  //   );
  // }
  
}
