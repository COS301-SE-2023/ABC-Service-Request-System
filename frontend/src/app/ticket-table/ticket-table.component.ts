import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
// import { tickets } from '../data';
import { TicketsService } from 'src/services/ticket.service';
import { ticket } from "../../../../backend/tickets/src/models/ticket.model";
import { ActivatedRoute, Route, Router } from '@angular/router';
import { user } from '../../../../backend/users/src/models/user.model';
import { Sort } from '@angular/material/sort';
import { AuthService } from 'src/services/auth.service';
import { GroupService } from 'src/services/group.service';
import { ClientService } from 'src/services/client.service';
import { client, project } from '../../../../backend/clients/src/models/client.model';
import { forkJoin } from 'rxjs';
import { UserService } from 'src/services/user.service';
import { format, parse } from 'date-fns';

@Component({
  selector: 'app-ticket-table',
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss']
})

export class TicketTableComponent implements OnInit{
  constructor(private ticketService: TicketsService, private router: Router, private authservice: AuthService, private groupService: GroupService,
    private userService: UserService, private clientService: ClientService, private route: ActivatedRoute) { }

  allTicketsArray: ticket[] = [];
  sortedTicketsArray: ticket[] = [];
  currentUserGroups: string[] = [];
  loggedInUserGroups:string[] = [];
  mutualGroups:string[]=[];
  selectedProject!: project;

  assigneeDetails!: user[];
  assignedDetails!: user[];

  ticketsReady = false;


  assignedName = '';
  assigneeName = '';

  inProfileOrSettings = false;
  normalDeadline = true;
  upcomingDeadline = false;
  overdueDeadline = false;

  currentUser?: user;
  isManager = true;

  @Input() viewProfileEmail = '';
  @Input() clientObjectRecieved!: client;
  @Input() tickets: any[] = [];
  @Input() ticketFailure!: boolean;
  @Output() openForm = new EventEmitter<string>();

  openUpdateForm(oldAssignee: string){
    this.openForm.emit(oldAssignee);
  }

  getClientGroups() {

    this.authservice.getUserObject().subscribe(
      (response) => {
        const user = response;
        const groupObservables = user.groups.map(group => {
          return this.groupService.getGroupNameById(group);
        });

        forkJoin(groupObservables).subscribe(
          (responses) => {
            responses.forEach(response => {
              const groupName = response.groupName;
              if (!this.loggedInUserGroups.includes(groupName)) {
                this.loggedInUserGroups.push(groupName);
              }
            });
          },
          (error) => {
            console.log("Error fetching group names for logged in user", error);
          }
        );
      }
    );

    if (this.viewProfileEmail != '') {
      this.userService.getUserByEmail(this.viewProfileEmail).subscribe(
        (response) => {
          const user = response;
          const groupObservables = user.groups.map(group => {
            return this.groupService.getGroupNameById(group);
          });

          forkJoin(groupObservables).subscribe(
            (responses: any) => {
              responses.forEach((response:any) => {
                const groupName = response.groupName;
                if (!this.currentUserGroups.includes(groupName)) {
                  this.currentUserGroups.push(groupName);
                }
              });

              // Call the different function here, as all group names have been fetched
              this.getTicketsForTable();
            },
            (error) => {
              console.log("Error fetching group names", error);
            }
          );
        }
      )
    } else {
      this.authservice.getUserObject().subscribe(
        (response) => {
          const user = response;
          const groupObservables = user.groups.map(group => {
            return this.groupService.getGroupNameById(group);
          });


          forkJoin(groupObservables).subscribe(
            (responses) => {
              responses.forEach(response => {
                const groupName = response.groupName;
                if (!this.currentUserGroups.includes(groupName)) {
                  this.currentUserGroups.push(groupName);
                }
              });


              // Call the different function here, as all group names have been fetched
              this.getTicketsForTable();
            },
            (error) => {
              console.log("Error fetching group names", error);
            }
          );
        }
      );
    }
  }

  getTicketsForTable(){
    const currentURL: string = window.location.href;

    const projectsObservable = this.clientService.getProjectsObservable();
    this.route.queryParams.subscribe(params => {
      if(currentURL.includes('client-dashboard')){
        const tempTickets: ticket [] = [];

        const clientProjects: project [] = this.clientObjectRecieved.projects;

        if(clientProjects && clientProjects.length > 0) {
          clientProjects.forEach((project: project, index: number, projectsArray: project[]) => {
            this.ticketService.getTicketsWithProjectName(project.name).subscribe(
              (res: ticket[]) => {
                tempTickets.push(...res);

                if (index === projectsArray.length - 1) {
                  tempTickets.forEach((ticket, indexInner: number, ticketsArrayInner: ticket []) => {
                    const promises :any = [];
                    const assigneeEmail = ticket.assignee;
                    const assignedEmail = ticket.assigned;

                    const assigneePromise = this.authservice.getUserNameByEmail(assigneeEmail).toPromise();
                    promises.push(assigneePromise.then((assignee) => {
                      ticket.assignee = assignee?.name + ' ' + assignee?.surname;
                    }));

                    const assignedPromise = this.authservice.getUserNameByEmail(assignedEmail).toPromise();
                    promises.push(assignedPromise.then((assigned) => {
                      ticket.assigned = assigned?.name + ' ' + assigned?.surname;
                    }));

                    if(indexInner === ticketsArrayInner.length -1){
                      // console.log('temp tickets now: ', tempTickets);
                      this.ticketsReady = true;
                      this.sortedTicketsArray = tempTickets;
                    }
                  });
                }
              }
            )
          })
        }

      } else if (currentURL.includes('settings')) {
        this.inProfileOrSettings = true;
        // console.log('dog 2');
        this.ticketService.getAllTickets().subscribe((response: ticket[]) => {
          // console.log('important: ', response);
          this.allTicketsArray = response.filter((ticket: ticket) => {
            return (this.currentUserGroups.includes(ticket.group) );
          })
          // console.log('settings ');
          // console.log(this.tickets);
          this.tickets = this.sortTickets(this.tickets);
          this.sortedTicketsArray = this.tickets.slice();
          // console.log(this.sortedTicketsArray);
          this.ticketsReady = true;
          this.tickets.forEach(tickets => {
            const promises :any = [];
            const assigneeEmail = tickets.assignee;
            const assignedEmail = tickets.assigned;

            const assigneePromise = this.authservice.getUserNameByEmail(assigneeEmail).toPromise();
            promises.push(assigneePromise.then((assignee) => {
              tickets.assignee = assignee?.name + ' ' + assignee?.surname;
            }));

            const assignedPromise = this.authservice.getUserNameByEmail(assignedEmail).toPromise();
            promises.push(assignedPromise.then((assigned) => {
              tickets.assigned = assigned?.name + ' ' + assigned?.surname;
            }));

          });
        });

      } else if (params['id']) {
        this.inProfileOrSettings = true;
        this.ticketService.getAllTickets().subscribe((response: ticket[]) => {
          // console.log('important: ', response);
          // console.log('loggedin user groups)');
          // console.log(this.loggedInUserGroups);
          // console.log('curr user groips');
          // console.log(this.currentUserGroups);

          for (const group of this.currentUserGroups) {
            if (this.loggedInUserGroups.includes(group)) {
              this.mutualGroups.push(group);
            }
          }

          // console.log('mutual groups');
          // console.log(this.mutualGroups);

          this.allTicketsArray = response.filter((ticket: ticket) => {
            return (this.mutualGroups.includes(ticket.group) );
          })

          this.allTicketsArray = this.sortTickets(this.allTicketsArray);
          this.sortedTicketsArray = this.allTicketsArray.slice();
          this.ticketsReady = true;
          this.allTicketsArray.forEach(tickets => {
            const promises :any = [];
            const assigneeEmail = tickets.assignee;
            const assignedEmail = tickets.assigned;

            const assigneePromise = this.authservice.getUserNameByEmail(assigneeEmail).toPromise();
            promises.push(assigneePromise.then((assignee) => {
              tickets.assignee = assignee?.name + ' ' + assignee?.surname;
            }));

            const assignedPromise = this.authservice.getUserNameByEmail(assignedEmail).toPromise();
            promises.push(assignedPromise.then((assigned) => {
              tickets.assigned = assigned?.name + ' ' + assigned?.surname;
            }));


          });
        });
      } else {
        // console.log('WORKING');
        this.inProfileOrSettings = false;
        if (projectsObservable !== undefined) {
          projectsObservable.subscribe((project) => {
            if (project !== undefined) {
              this.selectedProject = project;
              // console.log(this.selectedProject, ' pr selected');

              this.ticketService.getAllTickets().subscribe((response: ticket[]) => {
                // console.log('important: ', response);
                this.allTicketsArray = response.filter((ticket: ticket) => {
                  return (this.currentUserGroups.includes(ticket.group) && ticket.project === this.selectedProject.name);
                })

                // console.log("current user groups: ", this.currentUserGroups);
                // console.log("after filter", this.allTicketsArray);

                const promises :any = [];

                this.allTicketsArray.forEach(tickets => {
                  const assigneeEmail = tickets.assignee;
                  const assignedEmail = tickets.assigned;

                  const assigneePromise = this.authservice.getUserNameByEmail(assigneeEmail).toPromise();
                  promises.push(assigneePromise.then((assignee) => {
                    tickets.assignee = assignee?.name + ' ' + assignee?.surname;
                  }));

                  const assignedPromise = this.authservice.getUserNameByEmail(assignedEmail).toPromise();
                  promises.push(assignedPromise.then((assigned) => {
                    tickets.assigned = assigned?.name + ' ' + assigned?.surname;
                  }));


                });

                Promise.all(promises)
                .then(() => {
                  this.ticketsReady = true;
                })
                .catch((error) => {
                  console.error('Error occurred during promise execution:', error);
                });

                this.allTicketsArray = this.sortTickets(this.allTicketsArray);
                this.sortedTicketsArray = this.allTicketsArray.slice();
              });
            }
          });
        }
      }
    })

  }

  getOverdueDeadline(endDateString: string, ticketStatus: string) {

    if(ticketStatus === 'Done')
      return false;

    const dateFormat = 'dd/MM/yyyy';

    const endDate = parse(endDateString, dateFormat, new Date());

    const currentDate = new Date();
    // console.log(endDate);
    const differenceInMilliseconds = endDate.getTime() - currentDate.getTime();
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    if (differenceInDays < -1){
      return true
    }

    return false;
  }

  getApproacingDeadline(endDateString: string) {
    const dateFormat = 'dd/MM/yyyy';

    const endDate = parse(endDateString, dateFormat, new Date());

    const currentDate = new Date();
    // console.log(endDate);
    const differenceInMilliseconds = endDate.getTime() - currentDate.getTime();
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    if (differenceInDays > 0 && differenceInDays <= 3) {
      return true
    }

    return false;
  }

  ngOnInit(): void {
    const currentURL: string = window.location.href;

    if(currentURL.includes('client-dashboard'))
      this.getTicketsForTable();
    else
      this.getClientGroups();
    // this.getTicketsForTable();

      // this.assignedDetails.length = 0;
      // this.assigneeDetails.length = 0;
      this.authservice.getUserObject().subscribe(
        (result: any) => {
          this.currentUser = result;
          console.log(this.currentUser);
          if (this.currentUser?.roles[0] === "Manager") {
            this.isManager = true;
          } else {
            this.isManager = false;
          }
        });

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
    return tickets;
  }

  getAssigneeName(email: string) {
    this.authservice.getUserNameByEmail(email).subscribe((response: user) => {
      this.assignedName = response.name;
      // return response.name;
    });
  }

  getAssignedName(email: string) {
    this.authservice.getUserNameByEmail(email).subscribe((response: user) => {
      this.assigneeName = response.name;
      // return response.name;
    });
  }

  routeToNewTickets() {
    this.router.navigate(['/new-ticket-form']);
  }
}

