import { NavbarService } from 'src/services/navbar.service';
import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';
// import { Moment } from '@chartjs/adapter-moment';
import { group } from '../../../../backend/src/models/group.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { TicketsService } from 'src/services/ticket.service';
import { GroupService } from 'src/services/group.service';
import { UserService } from 'src/services/user.service';
import { user } from '../../../../backend/src/models/user.model';
import * as moment from 'moment';
import { ticket } from '../../../../backend/src/models/ticket.model';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnInit {
  selectedAnalyticsType = 'personal';
  averageTimeToFirstResponse!: string;
  timeToFirstResponseData!: number[];

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
  closedTicketsCount = 0;

  navbarIsCollapsed!: boolean;

  ngOnInit(): void {
    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
    });
  }

  personalHighPriorityTicketsCount = 0;
  personalMediumPriorityTicketsCount = 0;
  personalLowPriorityTicketsCount = 0;

  personalActiveTicketsCount = 0;
  personalPendingTicketsCount = 0;
  personalClosedTicketsCount = 0;


  groupActiveTicketsCount = 0;
  groupPendingTicketsCount = 0;
  groupOverdueTicketsCount = 0;
  groupTicketsDueTodayCount = 0;
  groupClosedTicketsCount = 0;

  userId!: string;

  averageTimeToResolution!: number;
  averageResolutionHours!: string;
  averageResolutionMinutes!: string

  averageResponseTime!: number;
  averageResponseHours!: string;
  averageResponseMinutes!: string;


  //charts
  doughnutChart!: Chart<"doughnut", (number | null)[], string>;
  polarChart!: Chart<"polarArea", (number | null)[], string>;
  lineChart!: Chart<'line', (number | null)[], string>;
  ticketResolutionLineChart!: Chart<'line', (number | null)[], string>;
 // ticketVolumeTrendChart!: Chart<'line', (number | null)[], string>;
 ticketVolumeTrendChart!: Chart<'line', (number)[], string>;


  @ViewChild('doughnutChartByPriorityCanvas', { static: true }) doughnutChartCanvas!: ElementRef;
  @ViewChild('polarChartCanvas', { static: true }) polarChartCanvas!: ElementRef;
  @ViewChild('lineChartCanvas', { static: true }) lineChartCanvas!: ElementRef;
  @ViewChild('ticketResolutionLineChartCanvas', { static: true }) ticketResolutionLineChartCanvas!: ElementRef;
  @ViewChild('ticketVolumeTrendChartCanvas', { static: true }) ticketVolumeTrendChartCanvas!: ElementRef;

  constructor(private router: Router, public authService: AuthService,
    private groupService: GroupService, private ticketsService: TicketsService, private userService: UserService,
    private changeDetector: ChangeDetectorRef, private navbarService: NavbarService) {}

  ngAfterViewInit(): void {
    console.log('in analytics page');

    //change name to id
    this.userId = this.authService.getUser().name;
    const userGroups: any [] = this.authService.getUser().groups;

    this.typeChanged('personal');

    // this.ticketsService.getActiveTicketsByUserId(userId).subscribe(
    //   activeTickets => {
    //     this.ActiveTicketsCount = activeTickets.length; // assuming activeTickets is an array
    //     console.log(activeTickets);
    //     this.changeDetector.detectChanges(); // trigger change detection manually, if needed
    //   },
    //   err => console.error(err)
    // );

    // this.ticketsService.getPendingTicketsByUserId(userId).subscribe(
    //   pendingTickets => {
    //     this.PendingTicketsCount = pendingTickets.length; // assuming pendingTickets is an array
    //     console.log(pendingTickets);
    //     this.changeDetector.detectChanges(); // trigger change detection manually, if needed
    //   },
    //   err => console.error(err)
    // );

    // this.ticketsService.getOverdueTicketsByUserId(userId).subscribe(
    //   overdueTickets => {
    //     this.overdueTicketsCount = overdueTickets.length;
    //     console.log(overdueTickets);
    //     this.changeDetector.detectChanges();
    //   },
    //   err => console.error(err)
    // );

    // // Get tickets due today count
    // this.ticketsService.getDueTodayTicketsByUserId(userId).subscribe(
    //   dueTodayTickets => {
    //     this.ticketsDueTodayCount = dueTodayTickets.length;
    //     console.log(dueTodayTickets);
    //     this.changeDetector.detectChanges();
    //   },
    //   err => console.error(err)
    // );

    let alreadyDone = false;

    for(let i = 0; i < userGroups.length; i++){
      this.groupService.getGroupsByUserId(userGroups[i]).subscribe(
        (response) => {
          this.groups.push(response);

          if(!alreadyDone){
            console.log(this.groups[0].id, ' hi');
            alreadyDone = true;
          }
          //this.groups = response;
          // Handle the groups data
          // console.log(this.groups);
        },
        (error) => {
          console.error(error);
          // Handle the error
        }
      );
    }

    // this.onGroupSelected(this.groups[0]);

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

    // Create the line chart
    // this.createLineChart();
    // this.populateLineChart();



    this.calculateAverageResponseTime();
    this.calculateAverageTimeToResolution();
    // Create the doughnut chart
    this.createDoughnutChart();
    this.createPolarChart();

    // Fetch ticket data and update the charts
    this.ticketsService.getTicketsWithName(this.userId).subscribe(
      (response) => {
        console.log("Tickets:", response); // Log received tickets
        this.createLineChart();
        this.updateLineChart(response);
        this.createTicketResolutionLineChart();
        this.updateTicketResolutionLineChart(response);

        this.createTicketVolumeTrendChart();
        this.updateTicketVolumeTrendChart(response);
        // ... other chart updates or other code that should be executed after fetching the tickets...
      },
      (error) => {
        console.log("Error fetching tickets for current user", error);
      }
    );

  }

  // onGroupSelected(groupId: string): void {
  //   const userId = this.authService.getUser().id;

  //   this.groupService.getGroupNameById(groupId).subscribe(
  //     (groupName: string) => {
  //       this.groupId = groupId;
  //       this.groupName = groupName;
  //       console.log("Group name", groupName);

  //       this.ticketsService.getActiveTicketsInGroup(userId, groupName).subscribe(
  //         activeTickets => {
  //           this.ActiveTicketsCount = activeTickets.length;
  //           console.log("Active ticket count", activeTickets);
  //           this.changeDetector.detectChanges();
  //         },
  //         err => console.error(err)
  //       );

  //       this.ticketsService.getPendingTicketsInGroup(userId, groupName).subscribe(
  //         pendingTickets => {
  //           this.PendingTicketsCount = pendingTickets.length;
  //           console.log(pendingTickets);
  //           this.changeDetector.detectChanges();
  //         },
  //         err => console.error(err)
  //       );

  //       this.ticketsService.getOverdueTicketsInGroup(userId, groupName).subscribe(
  //         overdueTickets => {
  //           this.overdueTicketsCount = overdueTickets.length;
  //           console.log(overdueTickets);
  //           this.changeDetector.detectChanges();
  //         },
  //         err => console.error(err)
  //       );

  //       this.ticketsService.getTicketsDueTodayInGroup(userId, groupName).subscribe(
  //         dueTodayTickets => {
  //           this.ticketsDueTodayCount = dueTodayTickets.length;
  //           console.log(dueTodayTickets);
  //           this.changeDetector.detectChanges();
  //         },
  //         err => console.error(err)
  //       );
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   );
  // }




  //update
  // handleFilterChange(filterValue: string): void {
  //   const userId = this.authService.getUser().id;

  //   if (filterValue === 'personal') {
  //     // Fetch personal ticket data
  //     this.ticketsService.getActiveTicketsByUserId(userId).subscribe(activeTickets => this.ActiveTicketsCount = activeTickets.length);
  //     this.ticketsService.getPendingTicketsByUserId(userId).subscribe(pendingTickets => this.PendingTicketsCount = pendingTickets.length);
  //     this.ticketsService.getOverdueTicketsByUserId(userId).subscribe(overdueTickets => this.overdueTicketsCount = overdueTickets.length);
  //     this.ticketsService.getDueTodayTicketsByUserId(userId).subscribe(dueTodayTickets => this.ticketsDueTodayCount = dueTodayTickets.length);
  //   } else if (filterValue === 'group' && this.groupId) {
  //     // Fetch group ticket data
  //     this.onGroupSelected(this.groupId);
  //   }
  // }


  selectGroup(group: group): void {
    this.selectedGroup = group;
    console.log('Selected Group ID:', group.id);
    // this.onGroupSelected(group.id);
  }

  typeChanged(value: any) {
    console.log('value is: ', value);

    if(value === 'personal') {
      this.ActiveTicketsCount = 0;
      this.PendingTicketsCount = 0;
      this.ticketsDueTodayCount = 0;
      this.overdueTicketsCount = 0;

      this.personalHighPriorityTicketsCount = 0;
      this.personalMediumPriorityTicketsCount = 0;
      this.personalLowPriorityTicketsCount = 0;

      this.personalActiveTicketsCount = 0;
      this.personalPendingTicketsCount = 0;
      this.personalClosedTicketsCount = 0;

      const todaysDate = new Date();
      todaysDate.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds and milliseconds

      console.log(todaysDate);

      this.ticketsService.getTicketsWithName(this.userId).subscribe(
        (response) => {
          console.log(response);

          response.forEach((ticket) => {
            // Parse the ticket endDate as a Date object
            const [day, month, year] = ticket.endDate.split("/").map(Number);
            const ticketEndDate = new Date(year, month - 1, day); // months are 0-indexed

            if(ticket.status === 'Active')
              this.ActiveTicketsCount++;
              this.personalActiveTicketsCount = this.ActiveTicketsCount;

            if(ticket.status === 'Pending')
              this.PendingTicketsCount++;
              this.personalPendingTicketsCount = this.PendingTicketsCount;

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
          this.updatePolarChart();
          this.updateDoughnutChart();
        }, (error) => {
          console.log("Error fetching tickets for current user", error);
        }
      )
    }

    if(value === 'group') {
      this.ActiveTicketsCount = 0;
      this.PendingTicketsCount = 0;
      this.ticketsDueTodayCount = 0;
      this.overdueTicketsCount = 0;
    }
  }

  onGroupSelected(groupId: string) {
    console.log('selected group id: ', groupId);
  }

  formatTimeValue(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  calculateAverageTimeToResolution(): void {
    this.userId = this.authService.getUser().name;

    this.ticketsService.getTicketsWithName(this.userId).subscribe(
      (tickets) => {
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
      },
      (error) => {
        console.error('Error retrieving user tickets:', error);
      }
    );
  }

  calculateAverageResponseTime(): void {
    this.ticketsService.getTicketsWithName(this.userId).subscribe(tickets => {
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
    });

  }

  updateLineChart(tickets: any[]): void {
    // clear previous data
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


  createLineChart(): void {
    this.lineChart = new Chart(this.lineChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Time to First Response (minutes)',
          data: [],
          borderColor: 'rgba(26, 188, 156, 1)',
          backgroundColor: 'rgba(26, 188, 156, 1)',
          tension: 0.2, // A bit smoother line
          pointRadius: 5, // Larger points
          pointHoverRadius: 7, // Even larger points on hover
          pointBorderColor: '#fff', // White points
          pointBackgroundColor: 'rgba(26, 188, 156, 1)' // Green points
        }],
      },
      options: {
        responsive: false,
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

  createTicketResolutionLineChart(): void {
    this.ticketResolutionLineChart = new Chart(this.ticketResolutionLineChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Time to Ticket Resolution (minutes)',
          data: [],
          borderColor: 'rgba(255, 91, 91, 0.66)',
          backgroundColor: 'rgba(255, 91, 91, 0.66)',
          tension: 0.2,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBorderColor: '#fff',
          pointBackgroundColor: 'rgba(255, 91, 91, 1)'
        }],
      },
      options: {
        responsive: false,
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

  createTicketVolumeTrendChart(): void {
    this.ticketVolumeTrendChart = new Chart(this.ticketVolumeTrendChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels : ["01-01-2017", "03-01-2017", "04-02-2017", "09-02-2017"],
        datasets: [
          {
            label: 'Ticket(s) Created',
            data : [ 186, 205, 1321, 1516, 2107,
              2191, 3133, 3221, 4783, 5478 ],
            borderColor: 'rgba(26, 188, 156, 1)',
            backgroundColor: 'rgba(26, 188, 156, 1)',
            tension: 0.2,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBorderColor: '#fff',
            pointBackgroundColor: 'rgba(26, 188, 156, 1)'
          },
          {
            label: 'Tickets Resolved',
            data : [ 1282, 1350, 2411, 2502, 2635,
              2809, 3947, 4402, 3700, 5267 ],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 1)',
            tension: 0.2,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBorderColor: '#fff',
            pointBackgroundColor: 'rgba(255, 99, 132, 1)'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true
          },
          y: {
            display: true
          }
        },
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  }

  updateTicketVolumeTrendChart(tickets: ticket[]) {
    const createdTimeData: number[] = [];
    const timeLabels: string[] = [];

    tickets.forEach((ticket) => {
      const ticketCreatedDate = ticket.createdAt;

      const date = new Date(ticketCreatedDate);
      const formattedDate = date.toISOString().split('T')[0];

      if(timeLabels.includes(formattedDate)){
        const index = timeLabels.indexOf(formattedDate);
        createdTimeData[index]++;
      } else {
        timeLabels.push(formattedDate);
        createdTimeData.push(1);
      }
    });

    tickets.forEach((ticket) => {
      if(ticket.status === 'Done' && ticket.timeToTicketResolution) {
        const ticketResolvedDate = ticket.timeToTicketResolution;
        const date = new Date(ticketResolvedDate);
        const formattedDate = date.toISOString().split('T')[0];

        if(timeLabels.includes(formattedDate)){
          //dont do anything, just incremenet resolutionTimeData at correct index
        } else {
          timeLabels.push(formattedDate);
          // resolutionTimeData.push(1);
        }
      }
    });

    const resolutionTimeData: number[] = new Array(timeLabels.length).fill(0);

    tickets.forEach((ticket) => {
      if(ticket.status === 'Done' && ticket.timeToTicketResolution) {
        const ticketResolvedDate = ticket.timeToTicketResolution;
        const date = new Date(ticketResolvedDate);
        const formattedDate = date.toISOString().split('T')[0];

        if(timeLabels.includes(formattedDate)){
          const index = timeLabels.indexOf(formattedDate);
          resolutionTimeData[index]++;
        }
      }
    });

    console.log('labels: ', timeLabels);
    console.log('data: ', createdTimeData);

    this.ticketVolumeTrendChart.data.labels = timeLabels;
    this.ticketVolumeTrendChart.data.datasets[0].data = createdTimeData;
    this.ticketVolumeTrendChart.data.datasets[1].data = resolutionTimeData;
    this.ticketVolumeTrendChart.update();
  }


  // updateTicketVolumeTrendChart(tickets: any[]): void {
  //   // Clear previous data
  //   this.ticketVolumeTrendChart.data.labels = [];
  //   this.ticketVolumeTrendChart.data.datasets[0].data = [];
  //   this.ticketVolumeTrendChart.data.datasets[1].data = [];

  //   this.userId = this.authService.getUser().name;

  //   // Get current date
  //   const currentDate = moment().startOf('day');

  //   const dateMap = new Map<string, { count: number; totalTimeToResolution: number }>();

  //   // Count of tickets created by the user today
  //   let todayTicketsCount = 0;

  //   // Loop 1: Count tickets created today by the user
  //   for (const ticket of tickets) {
  //     const createdAt = moment.utc(ticket.createdAt).local();

  //     // Check if ticket is created today by the user
  //     if (createdAt.isSame(currentDate, 'day') && ticket.assignee === this.userId) {
  //       todayTicketsCount++;
  //     }
  //   }

  //   console.log("Today's tickets count:", todayTicketsCount);

  //   // Log the dates being compared
  //   console.log('Comparison Dates:');
  //   console.log('------------------');
  //   console.log('Current Date:', currentDate.format('YYYY-MM-DD'));
  //   console.log('User ID:', this.userId);

  //   // Loop 2: Update dateMap with filtered tickets
  //   const filteredTickets = tickets.filter(ticket => ticket.status === 'Done' && ticket.timeToTicketResolution);
  //   for (const ticket of filteredTickets) {
  //     const createdAt = moment.utc(ticket.createdAt).local();
  //     const updatedAt = moment.utc(ticket.updatedAt).local();

  //     // Check if updatedAt is later than createdAt
  //     if (updatedAt.isSameOrAfter(createdAt)) {
  //       const timeToResolution = updatedAt.diff(createdAt, 'minutes');

  //       // Check if timeToResolution is not a number (NaN), if it is, skip to next ticket
  //       if (isNaN(timeToResolution)) continue;

  //       // Get the date key (YYYY-MM-DD) for the ticket
  //       const dateKey = createdAt.format('YYYY-MM-DD');

  //       // Update the date map
  //       if (dateMap.has(dateKey)) {
  //         const data = dateMap.get(dateKey)!;
  //         data.count++;
  //         data.totalTimeToResolution += timeToResolution;
  //       } else {
  //         dateMap.set(dateKey, { count: 1, totalTimeToResolution: timeToResolution });
  //       }
  //     }
  //   }

  //   // Sort the dates in ascending order
  //   const sortedDates = Array.from(dateMap.keys()).sort();

  //   // Populate the chart data
  //   for (const dateKey of sortedDates) {
  //     const data = dateMap.get(dateKey)!;

  //     // Add the date to chart labels
  //     this.ticketVolumeTrendChart.data.labels.push(dateKey);

  //     // Add the ticket count to the first dataset
  //     this.ticketVolumeTrendChart.data.datasets[0].data.push(todayTicketsCount);

  //     // Calculate the average time to resolution
  //     const averageTimeToResolution = data.totalTimeToResolution / data.count;
  //     this.ticketVolumeTrendChart.data.datasets[1].data.push(averageTimeToResolution);

  //     // Log the average resolution time
  //     console.log('Average Resolution Time for', dateKey, ':', averageTimeToResolution);
  //   }

  //   console.log('Chart labels:', this.ticketVolumeTrendChart.data.labels);
  //   console.log('Chart data (Ticket Count):', this.ticketVolumeTrendChart.data.datasets[0].data);
  //   console.log('Chart data (Average Resolution Time):', this.ticketVolumeTrendChart.data.datasets[1].data);

  //   // Update the chart to reflect new data
  //   this.ticketVolumeTrendChart.update();
  // }






  // updateTicketVolumeTrendChart(tickets: any[]): void {
  //   const DATA_COUNT = 7;
  //   const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};
  //   const labels = Utils.months({count: 7});
  //   const data = {
  //     labels: labels,
  //     datasets: [
  //       {
  //         label: 'Dataset 1',
  //         data: Utils.numbers(NUMBER_CFG),
  //         borderColor: Utils.CHART_COLORS.red,
  //         backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
  //       },
  //       {
  //         label: 'Dataset 2',
  //         data: Utils.numbers(NUMBER_CFG),
  //         borderColor: Utils.CHART_COLORS.blue,
  //         backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
  //       }
  //     ]
  //   };
  // }









  // updateTicketVolumeTrendChart(tickets: any[]): void {
  //   // Clear previous data
  //   this.ticketVolumeTrendChart.data.labels = [];
  //   this.ticketVolumeTrendChart.data.datasets[0].data = [];
  //   this.ticketVolumeTrendChart.data.datasets[1].data = [];

  //   // For each ticket
  //   const dateMap = new Map<string, { count: number; totalTimeToResolution: number }>();

  //   for (const ticket of tickets) {
  //     // Calculate time to ticket resolution (in minutes)
  //     const createdAt = new Date(ticket.createdAt);
  //     const resolvedAt = new Date(ticket.updatedAt);
  //     console.log('createdAt', createdAt);
  //     console.log('resolvedAt', resolvedAt);
  //     const timeToResolution = (resolvedAt.getTime() - createdAt.getTime()) / (1000 * 60);
  //     console.log('timeToResolution', timeToResolution);

  //     // Check if timeToResolution is not a number (NaN), if it is, skip to next ticket
  //     if (isNaN(timeToResolution)) continue;

  //     // Get the date key (YYYY-MM-DD) for the ticket
  //     const dateKey = createdAt.toISOString().slice(0, 10);

  //     // Update the date map
  //     if (dateMap.has(dateKey)) {
  //       const data = dateMap.get(dateKey)!;
  //       data.count++;
  //       data.totalTimeToResolution += timeToResolution;
  //     } else {
  //       dateMap.set(dateKey, { count: 1, totalTimeToResolution: timeToResolution });
  //     }
  //   }

  //   // Sort the dates in ascending order
  //   const sortedDates = Array.from(dateMap.keys()).sort();

  //   // Populate the chart data
  //   for (const dateKey of sortedDates) {
  //     const data = dateMap.get(dateKey)!;

  //     // Add the date to chart labels
  //     this.ticketVolumeTrendChart.data.labels.push(dateKey);

  //     // Add the ticket count to the first dataset
  //     this.ticketVolumeTrendChart.data.datasets[0].data.push(data.count);

  //     // Calculate the average time to resolution
  //     const averageTimeToResolution = data.totalTimeToResolution / data.count;
  //     this.ticketVolumeTrendChart.data.datasets[1].data.push(averageTimeToResolution);
  //   }

  //   console.log('Chart labels:', this.ticketVolumeTrendChart.data.labels);
  //   console.log('Chart data (Ticket Count):', this.ticketVolumeTrendChart.data.datasets[0].data);
  //   console.log('Chart data (Average Resolution Time):', this.ticketVolumeTrendChart.data.datasets[1].data);

  //   // Update the chart to reflect new data
  //   this.ticketVolumeTrendChart.update();
  // }
  // updateTicketVolumeTrendChart(tickets: any[]): void {
  //   // Clear previous data
  //   this.ticketVolumeTrendChart.data.labels = [];
  //   this.ticketVolumeTrendChart.data.datasets[0].data = [];
  //   this.ticketVolumeTrendChart.data.datasets[1].data = [];

  //   // For each ticket
  //   let ticketCount = 0;
  //   for (const ticket of tickets) {
  //     // Calculate time to ticket resolution (in minutes)
  //     const createdAt = new Date(ticket.createdAt);
  //     const resolvedAt = new Date(ticket.timeToTicketResolution);
  //     const timeToResolution = (resolvedAt.getTime() - createdAt.getTime()) / (1000 * 60);

  //     // Check if timeToResolution is not a number (NaN), if it is, skip to next ticket
  //     if (isNaN(timeToResolution)) continue;

  //     // Convert time to hours and minutes format
  //     const hours = Math.floor(timeToResolution / 60);
  //     const minutes = Math.round(timeToResolution % 60);
  //     const formattedResolutionTime = hours * 100 + minutes;

  //     // Add date to chart labels
  //     this.ticketVolumeTrendChart.data.labels.push(createdAt.toISOString().slice(0, 10)); // YYYY-MM-DD format

  //     // Add ticket creation count to first dataset
  //     ticketCount++;
  //     this.ticketVolumeTrendChart.data.datasets[0].data.push(ticketCount);

  //     // Add formatted resolution time to second dataset
  //     this.ticketVolumeTrendChart.data.datasets[1].data.push(formattedResolutionTime);
  //   }

  //   // Update the chart to reflect new data
  //   this.ticketVolumeTrendChart.update();
  // }






  createDoughnutChart(): void {
    const doughnutChartCtx = this.doughnutChartCanvas.nativeElement.getContext('2d');

    this.doughnutChart = new Chart(doughnutChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['High Priority', 'Medium Priority', 'Low Priority'],
            datasets: [
                {
                    data: [
                        this.personalHighPriorityTicketsCount,
                        this.personalMediumPriorityTicketsCount,
                        this.personalLowPriorityTicketsCount
                    ],

                    backgroundColor: ['rgba(231, 76, 60, 0.8)', 'rgba(241, 196, 15, 0.8)', 'rgba(46, 204, 113, 0.8)'],
                    //hoverBackgroundColor: ['rgba(192, 57, 43, 0.4)', 'rgba(243, 156, 18, 0.4)', 'rgba(39, 174, 96, 0.4)'], // different colors when mouse hovers over
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#fff' // white border on hover
                }
            ]
        },
        options: {
            responsive: false,
            cutout: '50%', // makes the doughnut hole larger
            animation: {
                animateRotate: true,
                animateScale: true // adds scaling animation
            },
            plugins: {
                legend: {
                    position: 'left',
                    labels: {
                        usePointStyle: true, // makes legend markers round
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.7)', // make tooltips slightly transparent
                    bodyFont: {
                        size: 14
                    },
                    cornerRadius: 5 // rounded corners for tooltips
                }
            }
        }
    });
  }


  updateDoughnutChart(): void {
    this.doughnutChart.data.datasets[0].data = [
      this.personalHighPriorityTicketsCount,
      this.personalMediumPriorityTicketsCount,
      this.personalLowPriorityTicketsCount
    ];
    this.doughnutChart.update();
  }

  createPolarChart(): void {
    const polarChartCtx = this.polarChartCanvas.nativeElement.getContext('2d');

    this.polarChart = new Chart(polarChartCtx, {
      type: 'polarArea',
      data: {
        labels: ['Active', 'Pending', 'Closed'],
        datasets: [
          {
            data: [
              this.personalActiveTicketsCount,
              this.personalPendingTicketsCount,
              this.personalClosedTicketsCount
            ],
            backgroundColor: ['rgba(46, 204, 113, 0.8)', 'rgba(241, 196, 15, 0.8)', 'rgba(231, 76, 60, 0.8)'],
            borderWidth: 0,
            borderColor: 'transparent' // Remove the lines
          }
        ]
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            position: 'left'
          }
        },
        scales: {
          r: {
            beginAtZero: true,
              grid: {
                    color: 'rgba(0, 0, 0, 0)',
              },
              ticks: {
                    backdropColor: 'rgba(0, 0, 0, 0)', // Hide radial scale backdrop
                    color: 'white', // White tick labels for contrast
            },
          }
        }
      }
    });
  }



  updatePolarChart(): void {
    this.polarChart.data.datasets[0].data = [
      this.personalActiveTicketsCount,
      this.personalPendingTicketsCount,
      this.personalClosedTicketsCount
    ];
    this.polarChart.update();
  }
}
