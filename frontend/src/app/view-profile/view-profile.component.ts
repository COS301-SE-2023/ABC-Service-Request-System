import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { UserService } from 'src/services/user.service';
import { user } from "../../../../backend/users/src/models/user.model";
import { AuthService } from 'src/services/auth.service';
import { Chart, registerables } from 'chart.js';
import { GroupService } from 'src/services/group.service';
import { group } from '../../../../backend/groups/src/models/group.model';
import { ActivatedRoute } from '@angular/router';
import { NavbarService } from 'src/services/navbar.service';
import { Router } from '@angular/router';
import { ticket } from '../../../../backend/tickets/src/models/ticket.model';
import { TicketsService } from 'src/services/ticket.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {

  constructor(private userService: UserService,
    private authService: AuthService,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private navbarService: NavbarService,
    private router: Router,
    private ticketsService: TicketsService) {}

    currentUser!: user;
    tempUser!:user;
    userBio?:string;
    githubLink?:string;
    linkedinLink?:string;
    groups: group[] = [];

    navbarIsCollapsed!: boolean;

    averageTimeToResolution!: number;
    averageResolutionHours!: string;
    averageResolutionMinutes!: string

    averageResponseTime!: number;
    averageResponseHours!: string;
    averageResponseMinutes!: string;

    overdueTicketsCount = 0;
    ticketsDueTodayCount = 0;
    ActiveTicketsCount = 0;
    PendingTicketsCount = 0;
    closedTicketsCount = 0;
    personalHighPriorityTicketsCount = 0;
    personalMediumPriorityTicketsCount = 0;
    personalLowPriorityTicketsCount = 0;

    personalClosedTicketsCount = 0;
    flag = true;


    lineChart!: Chart<'line', (number | null)[], string>;
    ticketResolutionLineChart!: Chart<'line', (number | null)[], string>;
  // ticketVolumeTrendChart!: Chart<'line', (number | null)[], string>;

    @ViewChild('lineChartCanvas', { static: true }) lineChartCanvas!: ElementRef;
    @ViewChild('ticketResolutionLineChartCanvas', { static: true }) ticketResolutionLineChartCanvas!: ElementRef;



  ngOnInit() {
    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
    });

    if (this.lineChart) {
      this.lineChart.destroy();
    }

    if (this.ticketResolutionLineChart) {
      this.ticketResolutionLineChart.destroy();
    }

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      console.log(id);
      if (id) {
        this.userService.getUser(id).subscribe(user => {
          this.currentUser = user;
          this.userBio = this.currentUser.bio;
          this.githubLink = this.currentUser.github;
          this.linkedinLink = this.currentUser.linkedin;
          this.currentUser.groups.forEach(groupId => {
            this.groupService.getGroupById(groupId).subscribe(group => {
              this.groups.push(group);
            });
          });
          if (this.lineChart) {
            this.lineChart.destroy();
          }

          if (this.ticketResolutionLineChart) {
            this.ticketResolutionLineChart.destroy();
          }

          this.currentUser.groups.forEach(groupId => {
            this.groupService.getGroupById(groupId).subscribe(group => {
              this.groups.push(group);
              this.createLineChart();
              this.createTicketResolutionLineChart();
              this.flag = true
            });
          });

        });
      }
    });

    if (this.flag) {

      this.route.queryParams.subscribe(params => {
        const id = params['id'];
        console.log(id);
        if (id) {
          this.userService.getUser(id).subscribe(user => {
            this.currentUser = user;

            if (this.lineChart) {
              this.lineChart.destroy();
            }

            if (this.ticketResolutionLineChart) {
              this.ticketResolutionLineChart.destroy();
            }

            this.ActiveTicketsCount = 0;
            this.PendingTicketsCount = 0;
            this.ticketsDueTodayCount = 0;
            this.overdueTicketsCount = 0;

            this.personalHighPriorityTicketsCount = 0;
            this.personalMediumPriorityTicketsCount = 0;
            this.personalLowPriorityTicketsCount = 0;

            this.personalClosedTicketsCount = 0;

            const todaysDate = new Date();
            todaysDate.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds and milliseconds

            console.log(todaysDate);
            this.ticketsService.getTicketsWithName(this.currentUser.emailAddress).subscribe(
              (response: any) => {
                console.log(response);

                  response.forEach((ticket: ticket) => {
                    // Parse the ticket endDate as a Date object
                    const [day, month, year] = ticket.endDate.split("/").map(Number);
                    const ticketEndDate = new Date(year, month - 1, day); // months are 0-indexed

                    if(ticket.status === 'Active')
                      this.ActiveTicketsCount++;

                    if(ticket.status === 'Pending')
                      this.PendingTicketsCount++;

                    if(ticket.status === 'Done')
                      this.personalClosedTicketsCount++;

                    if((ticket.status == 'Active' || ticket.status == 'Pending') && todaysDate.getTime() === ticketEndDate.getTime())
                      this.ticketsDueTodayCount++;

                    if((ticket.status == 'Active' || ticket.status == 'Pending') && todaysDate.getTime() > ticketEndDate.getTime())
                      this.overdueTicketsCount++;

                    if(ticket.priority === 'High'){
                      this.personalHighPriorityTicketsCount++;
                    }

                    if(ticket.priority === 'Medium'){
                      this.personalMediumPriorityTicketsCount++;
                    }

                    if(ticket.priority === 'Low'){
                      this.personalLowPriorityTicketsCount++;
                    }

                  });

                  this.updateLineChart(response);
                  this.updateTicketResolutionLineChart(response);
                  // this.updateTicketVolumeTrendChart(response);
                  this.calculateAverageResponseTime(response);
                  this.calculateAverageTimeToResolution(response);
              }, (error: Error) => {
                console.log("Error fetching tickets for current user", error);
              }
            );
          });
        }
      });

    }
  }

  updateLineChart(tickets: any[]): void {
    // clear previous data
    if (this.lineChart) {
      this.lineChart.destroy();
      this.createLineChart();
    }

    if (!this.lineChart || !this.lineChart.data) {
      return;
    }

    this.lineChart.data.labels = [];
    this.lineChart.data.datasets[0].data = [];

    // for each ticket
    for (const ticket of tickets) {
      // calculate time to first response (in minutes)
      const createdAt = new Date(ticket.createdAt);
      const firstResponseTime = new Date(ticket.timeToFirstResponse);
      const timeToFirstResponse = (firstResponseTime.getTime() - createdAt.getTime()) / (1000 * 60);

      // check if timeToFirstResponse is not a number (NaN), if it is, skip to next ticket
      if (isNaN(timeToFirstResponse)) continue;

      // convert time to hours and minutes format
      const hours = Math.floor(timeToFirstResponse / 60);
      const minutes = Math.round(timeToFirstResponse % 60);
      const formattedTime = hours * 100 + minutes;

      // add ticket id to chart labels
      this.lineChart.data.labels.push(ticket.summary);

      // add formatted time to chart data
      this.lineChart.data.datasets[0].data.push(formattedTime);
    }

    // console.log("Chart labels:", this.lineChart.data.labels); // Log labels
    // console.log("Chart data:", this.lineChart.data.datasets[0].data); // Log data

    // update the chart to reflect new data
    this.lineChart.update();
  }

  updateTicketResolutionLineChart(tickets: any[]): void {
    if (this.ticketResolutionLineChart) {
      this.ticketResolutionLineChart.destroy();
      this.createTicketResolutionLineChart();
    }
    // Clear previous data
    this.ticketResolutionLineChart.data.labels = [];
    this.ticketResolutionLineChart.data.datasets[0].data = [];

    // For each ticket
    for (const ticket of tickets) {
      // Calculate time to ticket resolution (in minutes)
      const createdAt = new Date(ticket.createdAt);
      const resolutionTime = new Date(ticket.timeToTicketResolution);
      const timeToTicketResolution = (resolutionTime.getTime() - createdAt.getTime()) / (1000 * 60);

      // Check if timeToTicketResolution is not a number (NaN), if it is, skip to next ticket
      if (isNaN(timeToTicketResolution)) continue;

      // Convert time to hours and minutes format for Ticket Resolution
      const resolutionHours = Math.floor(timeToTicketResolution / 60);
      const resolutionMinutes = Math.round(timeToTicketResolution % 60);
      const formattedResolutionTime = resolutionHours * 100 + resolutionMinutes;

      // Add ticket id to chart labels for Ticket Resolution
      this.ticketResolutionLineChart.data.labels.push(ticket.summary);

      // Add formatted time to chart data for Ticket Resolution
      this.ticketResolutionLineChart.data.datasets[0].data.push(formattedResolutionTime);
    }

    console.log("Chart labels:", this.ticketResolutionLineChart.data.labels); // Log labels
    console.log("Chart data:", this.ticketResolutionLineChart.data.datasets[0].data); // Log data
    // Update the chart to reflect new data for Ticket Resolution
    this.ticketResolutionLineChart.update();
  }

  createTicketResolutionLineChart(): void {
    if (this.ticketResolutionLineChart) {
      this.ticketResolutionLineChart.destroy();
    }
    this.ticketResolutionLineChart = new Chart(this.ticketResolutionLineChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Time to Ticket Resolution (minutes)',
          data: [],
          borderColor: 'rgba(255, 91, 91, 0.66)',
          backgroundColor: 'rgba(255, 91, 91, 0.66)',
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBorderColor: '#fff',
          pointBackgroundColor: 'rgba(255, 91, 91, 1)'
        }],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false, // Show y-axis labels
          }
        },
        plugins: {
          legend: {
            display: false,
          }
        }
      }
    });
  }

  createLineChart(): void {
    if (this.lineChart) {
      this.lineChart.destroy();
    }

    this.lineChart = new Chart(this.lineChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Time to First Response (minutes)',
          data: [],
          borderColor: 'rgba(26, 188, 156, 1)',
          backgroundColor: 'rgba(26, 188, 156, 1)',
          tension: 0.4, // A bit smoother line
          pointRadius: 5, // Larger points
          pointHoverRadius: 7, // Even larger points on hover
          pointBorderColor: '#fff', // White points
          pointBackgroundColor: 'rgba(26, 188, 156, 1)' // Green points
        }],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: false, // Hide x-axis labels
          },
          y: {
            display: false, // Hide y-axis labels
          }
        },
        plugins: {
          legend: {
            display: false, // Hide the legend
          }
        }
      }
    });
  }

  calculateAverageTimeToResolution(tickets: ticket[]): void {
    const resolvedTickets = tickets.filter(ticket => ticket.status === 'Done' && ticket.timeToTicketResolution);
    const totalResolutionTime = resolvedTickets.reduce((total, ticket) => {
      const createdAt = new Date(ticket.createdAt);
      const resolutionTime = new Date(ticket.timeToTicketResolution!); // Assert that timeToTicketResolution is not undefined
      const ticketResolutionTime = resolutionTime.getTime() - createdAt.getTime();
      return total + ticketResolutionTime;
    }, 0);

    if (resolvedTickets.length > 0) {
      const averageResolutionTime = totalResolutionTime / resolvedTickets.length;
      this.averageResolutionHours = this.formatTimeValue(Math.floor(averageResolutionTime / (1000 * 60 * 60)));
      this.averageResolutionMinutes = this.formatTimeValue(Math.floor((averageResolutionTime / (1000 * 60)) % 60));
      console.log('averageResolutionHours', this.averageResolutionHours);
      console.log('averageResolutionMinutes', this.averageResolutionMinutes);
    } else {
      this.averageResolutionHours = '00';
      this.averageResolutionMinutes = '00';
    }
  }

  formatTimeValue(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  calculateAverageResponseTime(tickets: ticket[]): void {
    let totalResponseTime = 0;
    let count = 0;

    tickets.forEach(ticket => {
      if (ticket.timeToFirstResponse) {
        const created = new Date(ticket.createdAt);
        const firstResponse = new Date(ticket.timeToFirstResponse);

        console.log('firstResponse', firstResponse);
        const diff = firstResponse.getTime() - created.getTime();

        totalResponseTime += diff;
        count++;
      }
    });

    if (count > 0) {
      const avgDiff = totalResponseTime / count; // average difference in milliseconds
      this.averageResponseHours = this.formatTimeValue(Math.floor((avgDiff / (1000 * 60 * 60)) % 24));
      this.averageResponseMinutes = this.formatTimeValue(Math.floor((avgDiff / (1000 * 60)) % 60));
    } else {
      this.averageResponseHours = '00';
      this.averageResponseMinutes = '00';
    }
  }

  routeToAnalytics(): void {
    this.router.navigateByUrl('/analytics-page');
  }
}
