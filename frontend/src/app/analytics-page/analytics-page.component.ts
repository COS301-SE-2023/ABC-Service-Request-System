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
  ticketsDueTodayCount = 0;
  ActiveTicketsCount = 0;
  PendingTicketsCount = 0;

  constructor(private router: Router, public authService: AuthService,
    private groupService: GroupService, private ticketsService: TicketsService, private userService: UserService,
    private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('in analytics page');
  
    const userId = this.authService.getUser().id;
    const userGroups: any [] = this.authService.getUser().groups;

    
    this.ticketsService.getActiveTicketsByUserId(userId).subscribe(
      activeTickets => {
        this.ActiveTicketsCount = activeTickets.length; // assuming activeTickets is an array
        console.log(activeTickets);
        this.changeDetector.detectChanges(); // trigger change detection manually, if needed
      },
      err => console.error(err)
    );

    this.ticketsService.getPendingTicketsByUserId(userId).subscribe(
      pendingTickets => {
        this.PendingTicketsCount = pendingTickets.length; // assuming pendingTickets is an array
        console.log(pendingTickets);
        this.changeDetector.detectChanges(); // trigger change detection manually, if needed
      },
      err => console.error(err)
    );

    this.ticketsService.getOverdueTicketsByUserId(userId).subscribe(
      overdueTickets => {
        this.overdueTicketsCount = overdueTickets.length;
        console.log(overdueTickets);
        this.changeDetector.detectChanges();
      },
      err => console.error(err)
    );
  
    // Get tickets due today count
    this.ticketsService.getDueTodayTicketsByUserId(userId).subscribe(
      dueTodayTickets => {
        this.ticketsDueTodayCount = dueTodayTickets.length;
        console.log(dueTodayTickets);
        this.changeDetector.detectChanges();
      },
      err => console.error(err)
    );

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

  
}
