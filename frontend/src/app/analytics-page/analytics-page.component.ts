import { NavbarService } from 'src/services/navbar.service';
import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js/auto';
// import { Moment } from '@chartjs/adapter-moment';
import { group } from '../../../../backend/groups/src/models/group.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { TicketsService } from 'src/services/ticket.service';
import { GroupService } from 'src/services/group.service';
import { UserService } from 'src/services/user.service';
import { user } from "../../../../backend/users/src/models/user.model";
import * as moment from 'moment';
import { WorklogEntry, ticket } from "../../../../backend/tickets/src/models/ticket.model";

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnInit {
  selectedAnalyticsType = 'personal';
  averageTimeToFirstResponse!: string;
  timeToFirstResponseData!: number[];

  sgroup!: string;
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

  latestWorklogs: WorklogEntry[] = [];


  ngOnInit(): void {
    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
    });

    this.fetchLatestWorklogs();
  }

  personalHighPriorityTicketsCount = 0;
  personalMediumPriorityTicketsCount = 0;
  personalLowPriorityTicketsCount = 0;

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

  timeToFirstResponseArray: ticket[] = [];
  timeToTicketResolutionArray: ticket [] = [];

  responsePercentChange = 0;
  resolutionPercentChange = 0;

  responsePercentChangeAbs = 0;
  resolutionPercentChangeAbs = 0;

  responseTrend!: string;
  resolutionTrend!: string;





  //charts
  doughnutChart!: Chart<"doughnut", (number | null)[], string>;
  polarChart!: Chart<"polarArea", (number | null)[], string>;
  lineChart!: Chart<'line', (number | null)[], string>;
  ticketResolutionLineChart!: Chart<'line', (number | null)[], string>;
 // ticketVolumeTrendChart!: Chart<'line', (number | null)[], string>;
 ticketVolumeTrendChart!: Chart<'line', (number)[], string>;
  burnDownChart!: Chart<'line', (number)[], string>;

  @ViewChild('doughnutChartByPriorityCanvas', { static: true }) doughnutChartCanvas!: ElementRef;
  @ViewChild('polarChartCanvas', { static: true }) polarChartCanvas!: ElementRef;
  @ViewChild('lineChartCanvas', { static: true }) lineChartCanvas!: ElementRef;
  @ViewChild('ticketResolutionLineChartCanvas', { static: true }) ticketResolutionLineChartCanvas!: ElementRef;
  @ViewChild('ticketVolumeTrendChartCanvas', { static: true }) ticketVolumeTrendChartCanvas!: ElementRef;
  @ViewChild('burnDownChartCanvas', {static: true}) burnDownChartCanvas!: ElementRef;

  constructor(private router: Router, public authService: AuthService,
    private groupService: GroupService, private ticketsService: TicketsService, private userService: UserService,
    private changeDetector: ChangeDetectorRef, private navbarService: NavbarService) {}

  ngAfterViewInit(): void {
    console.log('in analytics page');

    //change name to id

    this.userId = this.authService.getUser().emailAddress;
    console.log('user id: ', this.userId);

    const userGroups: any [] = this.authService.getUser().groups;



    this.typeChanged('personal');

    let alreadyDone = false;

    for(let i = 0; i < userGroups.length; i++){
      this.groupService.getGroupsByUserId(userGroups[i]).subscribe(
        (response) => {
          if(!this.groups.includes(response))
            this.groups.push(response);

          if(!alreadyDone){
            console.log(this.groups[0].id, ' hi');
            this.sgroup = response.id;
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
    // Create the doughnut chart
    this.createDoughnutChart();
    this.createPolarChart();
    this.createLineChart();
    this.createTicketResolutionLineChart();
    this.createTicketVolumeTrendChart();
    this.createBurnDownChart();

  }

  private fetchLatestWorklogs() {
    const username = this.authService.getUser().name;
    console.log(username + " username")

    this.ticketsService.getUserLatestWorklogs(username).subscribe((response: WorklogEntry[]) => {
        if (response && response.length > 0) {
            this.latestWorklogs = response;
        } else {
            console.warn('Unexpected format for worklogs data:', response);
        }
        console.log('Latest Worklogs:', this.latestWorklogs);
    }, error => {
        console.error('Error fetching latest worklogs:', error);
    });
}

fetchUserWorklogsInGroup(userId: string, groupName: string): void {
  this.ticketsService.getUserLatestWorklogsByGroup(userId, groupName).subscribe(
      data => {
          this.latestWorklogs = data;
          console.log("latestWorklogs" , this.latestWorklogs);
      },
      error => {
          console.error("Error fetching user's worklogs in group:", error);
      }
  );
}

  getHours(timeSpent: string): number {
    return parseInt(timeSpent.replace('h', ''), 10);
  }


  selectGroup(id: string): void {
    const username = this.authService.getUser().name;
    console.log('Selected Group ID # 1:', this.sgroup)
    const group = this.groups.find(group => group.id === id);
    if (group) {
        this.selectedGroup = group;
        console.log('Selected Group ID # 2:', group.groupName);
        this.onGroupSelected(group.groupName);

        this.fetchUserWorklogsInGroup(username, group.groupName);
        console.log("user idddd:" , username);
        console.log("user group:" , group.groupName);
    } else {
        console.log(`No group found with id ${id}`);
    }
}

  typeChanged(value: any) {
    console.log('value is: ', value);

    if(value === 'personal') {
      this.fetchLatestWorklogs();
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

      console.log('user id is: ', this.userId);
      this.ticketsService.getTicketsWithName(this.userId).subscribe(
        (response) => {
          console.log(response);

          response.forEach((ticket) => {
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
          this.updatePolarChart();
          this.updateDoughnutChart();
          // this.updateLineChart(response);
          this.updateTicketResolutionLineChart(response);
          this.updateTicketVolumeTrendChart(response);
          this.sortResponseTimeTickets(response);
          this.sortResolutionTimeTickets(response);

          this.updateBurnDownChart(response);

          // console.log('all tickets: ', response);
        }, (error) => {
          console.log("Error fetching tickets for current user", error);
        }
      )
    }

    if(value === 'group' && this.groups.length > 0) {


      this.selectGroup(this.groups[0].id);



    }
  }

  onGroupSelected(groupName: string) {

      this.ActiveTicketsCount = 0;
      this.PendingTicketsCount = 0;
      this.ticketsDueTodayCount = 0;
      this.overdueTicketsCount = 0;

      this.personalHighPriorityTicketsCount = 0;
      this.personalMediumPriorityTicketsCount = 0;
      this.personalLowPriorityTicketsCount = 0;

      this.personalClosedTicketsCount = 0;

    console.log('selected group name: ', groupName);
    const todaysDate = new Date();
    todaysDate.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds and milliseconds
    this.ticketsService.getTicketsWithGroupName(groupName).subscribe(
      (response) => {

        response.forEach((ticket) => {
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
          this.updatePolarChart();
          this.updateDoughnutChart();
          // this.updateLineChart(response);
          this.updateTicketResolutionLineChart(response);
          this.updateTicketVolumeTrendChart(response);
          this.sortResponseTimeTickets(response);
          this.sortResolutionTimeTickets(response);
        });

      }, (error) => {
        console.log("error fetching tickets by group name", error);
      }
    );

  }

  formatTimeValue(value: number): string {
    return value < 10
     ? `0${value}` : value.toString();
  }

  sortResponseTimeTickets(tickets: ticket[]): void {
    // Filter out tickets without a valid response time
    const tempTickets = tickets.filter(ticket => ticket.timeToFirstResponse);


    // Sort the filtered tickets by response time
    tempTickets.sort((a, b) => {
      const responseTimeA = new Date(a.timeToFirstResponse!).getTime();
      const responseTimeB = new Date(b.timeToFirstResponse!).getTime();

      // Compare response times for sorting
      return responseTimeA - responseTimeB;
    });


    console.log("Sorted tickets by response time:", tempTickets);
    this.calculateAverageResponseTime(tempTickets);
  }

  sortResolutionTimeTickets(tickets: ticket[]): void {
    // Filter out tickets without a valid response time
    const tempTickets = tickets.filter(ticket => ticket.timeToTicketResolution);

    // Sort the filtered tickets by response time
    tempTickets.sort((a, b) => {
      const responseTimeA = new Date(a.timeToTicketResolution!).getTime();
      const responseTimeB = new Date(b.timeToTicketResolution!).getTime();

      // Compare response times for sorting
      return responseTimeA - responseTimeB;
    });

    console.log("Sorted tickets by response time:", tempTickets);
    this.calculateAverageTimeToResolution(tempTickets);
  }


  calculateAverageResponseTime(tickets: ticket[]): void {
    let totalResponseTime = 0;
    let count = 0;

    tickets.forEach(ticket => {
      if (ticket.timeToFirstResponse) {
        const created = new Date(ticket.createdAt);
        const firstResponse = new Date(ticket.timeToFirstResponse);

        // console.log('firstResponse', firstResponse);
        const diff = firstResponse.getTime() - created.getTime();

        totalResponseTime += diff;
        count++;

        this.timeToFirstResponseArray.push(ticket);
        // console.log("timeToFirstResponseArray: " , this.timeToFirstResponseArray);
        this.calculateResponseTrend();




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
    this.updateLineChart(tickets);
  }

  calculateResponseTrend(): string {
    // Default color for insufficient data
    let trendColor = 'rgb(0, 196, 255)';

    // Ensure there are at least two tickets to compare
    if (this.timeToFirstResponseArray.length >= 2) {
        const lastIndex = this.timeToFirstResponseArray.length - 1;

        // Access the last two tickets
        const lastTicket = this.timeToFirstResponseArray[lastIndex];
        const secondLastTicket = this.timeToFirstResponseArray[lastIndex - 1];

        // Convert the timeToFirstResponse to Date objects with non-null assertion
        const lastResponseTime = new Date(lastTicket.timeToFirstResponse!).getTime();
        const secondLastResponseTime = new Date(secondLastTicket.timeToFirstResponse!).getTime();
        const lastCreatedTime = new Date(lastTicket.createdAt).getTime();
        const secondLastCreatedTime = new Date(secondLastTicket.createdAt).getTime();

        // Calculate the difference in response times for both tickets
        const diffLast = lastResponseTime - lastCreatedTime;
        const diffSecondLast = secondLastResponseTime - secondLastCreatedTime;

        // Calculate the percentage change
        this.responsePercentChange = ((diffLast - diffSecondLast) / diffSecondLast) * 100;
        this.responsePercentChange = Math.round(this.responsePercentChange * 100) / 100; // Rounding to 2 decimal
        console.log(" this.responsePercentChange ",  this.responsePercentChange );

        this.responsePercentChangeAbs = Math.abs(this.responsePercentChange);

        //this.updateBadge();
        // Determine the trend and set the trendColor
        if (diffLast < diffSecondLast) {
            // console.log(`Positive Response trend: ${percentChange}% improvement`);
            this.responseTrend = 'positive';
            trendColor = 'rgba(26, 188, 156, 1)'; // Positive trend
            console.log("trendColour Response", trendColor);

        } else if (diffLast > diffSecondLast) {
            // console.log(`Negative Response trend: ${percentChange}% worsening`);
            this.responseTrend = 'negative';
            trendColor = 'rgba(255, 91, 91, 1)'; // Negative trend
            console.log("trendColour Response", trendColor);
        } else {
            // console.log("Neutral Response trend: 0% change");
            this.responseTrend = 'neutral';
            trendColor = 'rgb(0, 196, 255)'; // Neutral trend
            console.log("trendColour Response", trendColor);
        }
    }

    // this.lineChart.update();

    return trendColor; // This will return one of the colors: "gray", "green", "red", or "yellow"
}



  updateChartColors(): void {
    const trendColor = this.calculateResponseTrend();
    if (this.lineChart) {
        this.lineChart.data.datasets[0].borderColor = trendColor;
        this.lineChart.data.datasets[0].backgroundColor = trendColor;
        this.lineChart.data.datasets[0].pointBackgroundColor = trendColor;
        this.lineChart.update();

    }
    console.log("updateChartColors Response", trendColor)
  }

  updateChartColorsResolution(): void {
    const trendColor = this.calculateResolutionTrend();
    console.log (" Update calculateResolutionTrend", trendColor);
    if (this.ticketResolutionLineChart) {
        this.ticketResolutionLineChart.data.datasets[0].borderColor = trendColor;
        this.ticketResolutionLineChart.data.datasets[0].backgroundColor = trendColor;
        this.ticketResolutionLineChart.data.datasets[0].pointBackgroundColor = trendColor;
        this.ticketResolutionLineChart.update();

    }
    // console.log("updateChartColors Resolution", trendColor)
  }

  getBadgeResponseClass(): string {
    switch(this.responseTrend) {
      case 'positive': return 'graph-badge-green';
      case 'negative': return 'graph-badge-red';
      default: return 'graph-badge-neutral';
    }
  }


  getArrowResponseClass(): string {
    switch(this.responseTrend) {
        case 'positive': return "fa-solid fa-arrow-trend-down";
        case 'negative': return "fa-solid fa-arrow-trend-up";
        default: return 'fa-solid fa-minus';               // Horizontal line for neutral trend
    }
}



  getArrowResolutionClass(): string {
    switch(this.resolutionTrend ) {
        case 'positive': return "fa-solid fa-arrow-trend-down";  // Assuming arrow down indicates improvement
        case 'negative': return "fa-solid fa-arrow-trend-up";    // Arrow up for worsening trend
        default: return 'fa-solid fa-minus';               // Horizontal line for neutral trend
    }
  }





  calculateAverageTimeToResolution(tickets: ticket[]): void {
    const resolvedTickets = tickets.filter(ticket => ticket.status === 'Done' && ticket.timeToTicketResolution);
    this.timeToTicketResolutionArray = resolvedTickets;
    console.log("timeToTicketResolutionArray", this.timeToTicketResolutionArray);

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

      this.calculateResolutionTrend();
      // console.log('averageResolutionHours', this.averageResolutionHours);
      // console.log('averageResolutionMinutes', this.averageResolutionMinutes);
    } else {
      this.averageResolutionHours = '00';
      this.averageResolutionMinutes = '00';
    }


    this.updateTicketResolutionLineChart(tickets);

  }

  calculateResolutionTrend(): string {
    // Default color for insufficient data
    let trendColor = 'rgb(0, 196, 255)';  // Neutral color

    // Ensure there are at least two tickets to compare
    if (this.timeToTicketResolutionArray.length >= 2) {
        const lastIndex = this.timeToTicketResolutionArray.length - 1;

        // Access the last two tickets
        const lastTicket = this.timeToTicketResolutionArray[lastIndex];
        const secondLastTicket = this.timeToTicketResolutionArray[lastIndex - 1];



        // Convert the timeToTicketResolution to Date objects with non-null assertion
        const lastResolutionTime = new Date(lastTicket.timeToTicketResolution!).getTime();
        const secondLastResolutionTime = new Date(secondLastTicket.timeToTicketResolution!).getTime();
        const lastCreatedTime = new Date(lastTicket.createdAt).getTime();
        const secondLastCreatedTime = new Date(secondLastTicket.createdAt).getTime();

        // Calculate the difference in resolution times for both tickets
        const diffLast = lastResolutionTime - lastCreatedTime;
        const diffSecondLast = secondLastResolutionTime - secondLastCreatedTime;

        // Calculate the percentage change
        this.resolutionPercentChange = ((diffLast - diffSecondLast) / diffSecondLast) * 100;
        this.resolutionPercentChange = Math.round(this.resolutionPercentChange * 100) / 100;  // Rounding to 2 decimal places

        this.resolutionPercentChangeAbs = Math.abs(this.resolutionPercentChange);

        // Determine the trend and set the trendColor
        if (this.resolutionPercentChange > 0) {
            // console.log(`Negative Resolution trend: ${percentageChange}% worsening`);
            this.resolutionTrend = "negative";
            trendColor = 'rgba(255, 91, 91, 1)';  // Negative trend
        } else if (this.resolutionPercentChange < 0) {
            // console.log(`Positive Resolution trend: ${Math.abs(percentageChange)}% improvement`);
            this.resolutionTrend = "positive";
            trendColor = 'rgba(26, 188, 156, 1)';  // Positive trend
        } else {
            // console.log("Neutral Resolution trend: 0% change");
            this.resolutionTrend = "neutral";
            trendColor = 'rgb(0, 196, 255)';
        }

        console.log("trendColour Resolution", trendColor);
    }

    return trendColor;  // This will return one of the colors: "gray", "green", or "red"
  }

  calculateResponseTrendCSS(): string {
    // Default color for insufficient data
    let trendColor = 'graph-badge-blue';

    // Ensure there are at least two tickets to compare
    if (this.timeToFirstResponseArray.length >= 2) {
        const lastIndex = this.timeToFirstResponseArray.length - 1;

        // Access the last two tickets
        const lastTicket = this.timeToFirstResponseArray[lastIndex];
        const secondLastTicket = this.timeToFirstResponseArray[lastIndex - 1];

        // Convert the timeToFirstResponse to Date objects with non-null assertion
        const lastResponseTime = new Date(lastTicket.timeToFirstResponse!).getTime();
        const secondLastResponseTime = new Date(secondLastTicket.timeToFirstResponse!).getTime();
        const lastCreatedTime = new Date(lastTicket.createdAt).getTime();
        const secondLastCreatedTime = new Date(secondLastTicket.createdAt).getTime();

        // Calculate the difference in response times for both tickets
        const diffLast = lastResponseTime - lastCreatedTime;
        const diffSecondLast = secondLastResponseTime - secondLastCreatedTime;

        // Calculate the percentage change
        this.responsePercentChange = ((diffLast - diffSecondLast) / diffSecondLast) * 100;
        this.responsePercentChange = Math.round(this.responsePercentChange * 100) / 100; // Rounding to 2 decimal
        console.log(" this.responsePercentChange ",  this.responsePercentChange )

        //this.updateBadge();
        // Determine the trend and set the trendColor
        if (diffLast < diffSecondLast) {
            // console.log(`Positive Response trend: ${percentChange}% improvement`);
            trendColor = 'graph-badge-green'; // Positive trend

        } else if (diffLast > diffSecondLast) {
            // console.log(`Negative Response trend: ${percentChange}% worsening`);
            trendColor = 'graph-badge-red'; // Negative trend

        } else {
            // console.log("Neutral Response trend: 0% change")
            trendColor = 'graph-badge-blue'; // Neutral trend
        }
    }

    // this.lineChart.update();

    return trendColor; // This will return one of the colors: "gray", "green", "red", or "yellow"
}

  calculateResolutionTrendCSS(): string {
    // Default color for insufficient data
    let trendColor = 'graph-badge-blue';  // Neutral color

    // Ensure there are at least two tickets to compare
    if (this.timeToTicketResolutionArray.length >= 2) {
        const lastIndex = this.timeToTicketResolutionArray.length - 1;

        // Access the last two tickets
        const lastTicket = this.timeToTicketResolutionArray[lastIndex];
        const secondLastTicket = this.timeToTicketResolutionArray[lastIndex - 1];



        // Convert the timeToTicketResolution to Date objects with non-null assertion
        const lastResolutionTime = new Date(lastTicket.timeToTicketResolution!).getTime();
        const secondLastResolutionTime = new Date(secondLastTicket.timeToTicketResolution!).getTime();
        const lastCreatedTime = new Date(lastTicket.createdAt).getTime();
        const secondLastCreatedTime = new Date(secondLastTicket.createdAt).getTime();

        // Calculate the difference in resolution times for both tickets
        const diffLast = lastResolutionTime - lastCreatedTime;
        const diffSecondLast = secondLastResolutionTime - secondLastCreatedTime;

        // Calculate the percentage change
        this.resolutionPercentChange = ((diffLast - diffSecondLast) / diffSecondLast) * 100;
        this.resolutionPercentChange = Math.round(this.resolutionPercentChange * 100) / 100;  // Rounding to 2 decimal places

        // Determine the trend and set the trendColor
        if (this.resolutionPercentChange > 0) {
            // console.log(`Negative Resolution trend: ${percentageChange}% worsening`);
            trendColor = "graph-badge-red";  // Negative trend
        } else if (this.resolutionPercentChange < 0) {
            // console.log(`Positive Resolution trend: ${Math.abs(percentageChange)}% improvement`);
            trendColor = "graph-badge-green";  // Positive trend
        } else {
            // console.log("Neutral Resolution trend: 0% change");
            trendColor = 'graph-badge-blue';
        }

        console.log("trendColour Resolution", trendColor);
    }

    return trendColor;  // This will return one of the colors: "gray", "green", or "red"
  }






  updateLineChart(tickets: any[]): void {
    // clear previous data
    this.lineChart.data.labels = [];
    this.lineChart.data.datasets[0].data = [];

    console.log('problem child, ', tickets);
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

    // Calculate time to first response for the latest ticket
    // const latestTicket = tickets[tickets.length - 1];
    // if(latestTicket != undefined && latestTicket != null) {
    //   const createdAtLatest = new Date(latestTicket.createdAt);
    //   const firstResponseTimeLatest = new Date(latestTicket.timeToFirstResponse);
    //   const timeToFirstResponseLatest = (firstResponseTimeLatest.getTime() - createdAtLatest.getTime()) / (1000 * 60);

    //   // Check if timeToFirstResponseLatest is not a number (NaN), if it is, skip adding to the chart
    //   if (!isNaN(timeToFirstResponseLatest)) {
    //     // Convert time to hours and minutes format for the latest ticket
    //     const hoursLatest = Math.floor(timeToFirstResponseLatest / 60);
    //     const minutesLatest = Math.round(timeToFirstResponseLatest % 60);
    //     const formattedTimeLatest = hoursLatest * 100 + minutesLatest;

    //     // Add the latest ticket id to the end of chart labels
    //     this.lineChart.data.labels.push(latestTicket.summary);

    //     // Add the formatted time for the latest ticket to the end of chart data
    //     this.lineChart.data.datasets[0].data.push(formattedTimeLatest);
    //   }
    // }

    // console.log("Chart labels:", this.lineChart.data.labels); // Log labels
    // console.log("Chart data:", this.lineChart.data.datasets[0].data); // Log data

    const trendColor = this.calculateResponseTrend();
    this.lineChart.data.datasets[0].borderColor = trendColor;
    this.lineChart.data.datasets[0].backgroundColor = trendColor;
    this.lineChart.data.datasets[0].pointBackgroundColor = trendColor;

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

    const trendColor = this.calculateResolutionTrend();
    // console.log ("Updated Resolution trendColor", trendColor)
    this.ticketResolutionLineChart.data.datasets[0].borderColor = trendColor;
    this.ticketResolutionLineChart.data.datasets[0].backgroundColor = trendColor;
    this.ticketResolutionLineChart.data.datasets[0].pointBackgroundColor = trendColor;

    this.ticketResolutionLineChart.update();
  }


  createLineChart(): void {
    const trendColour = this.calculateResponseTrend();
    // console.log("trendColour Chart", trendColour);
    this.lineChart = new Chart(this.lineChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'minutes:',
          data: [],
          borderColor: trendColour,
          backgroundColor: trendColour,
          tension: 0.4, // A bit smoother line
          pointRadius: 5, // Larger points
          pointHoverRadius: 7, // Even larger points on hover
          pointBorderColor: '#fff', // White points
          pointBackgroundColor: trendColour // Green points
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

  createTicketResolutionLineChart(): void {
    const trendColour = this.calculateResolutionTrend();
    // console.log("trendColour Chart", trendColour);
    this.ticketResolutionLineChart = new Chart(this.ticketResolutionLineChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'minutes: ',
          data: [],
          borderColor: trendColour,
          backgroundColor: trendColour,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBorderColor: '#fff',
          pointBackgroundColor: trendColour
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

  createTicketVolumeTrendChart(): void {
    this.ticketVolumeTrendChart = new Chart(this.ticketVolumeTrendChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels : ["01-01-2017", "03-01-2017", "04-02-2017", "09-02-2017"],
        datasets: [
          {
            label: 'Ticket(s) Created',
            data : [ 186, 205, 1321, 1516, 2107, 2191, 3133, 3221, 4783, 5478 ],
            borderColor: 'rgba(26, 188, 156, 1)',
            backgroundColor: 'rgba(26, 188, 156, 0.2)',  // Change opacity to 0.2 for better visualization
            tension: 0,   // Slightly increase tension for smoother lines
            pointRadius: 5,
            pointHoverRadius: 6,
            pointBorderColor: '#fff',
            pointBackgroundColor: 'rgba(26, 188, 156, 1)',
            borderWidth: 2   // Increase the line width for better visibility
          },
          {
            label: 'Tickets Resolved',
            data : [ 1282, 1350, 2411, 2502, 2635, 2809, 3947, 4402, 3700, 5267 ],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Change opacity to 0.2 for better visualization
            tension: 0,   // Slightly increase tension for smoother lines
            pointRadius: 5,
            pointHoverRadius: 6,
            pointBorderColor: '#fff',
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2    // Increase the line width for better visibility
          }
        ]
      },
      options: {
        responsive: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date'   // Add title to X-Axis
            }
          },
          y: {
            beginAtZero: false,
            max: 5,
            display: true,
            title: {
              display: true,
              text: 'Ticket Volume'   // Add title to Y-Axis
            },
            ticks: {
              stepSize: 1,  // This will ensure the y-axis has a step size of 1
              precision: 0,  // This will set the precision to 0, effectively displaying only whole numbers,
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',  // Change legend position to bottom
            labels: {
              boxWidth: 20,   // Increase the boxWidth
              padding: 20     // Increase the padding
            }
          },
          tooltip: {  // Enable tooltips
            enabled: true,

          }

        }
      }
    });
  }

  updateBurnDownChart(tickets: ticket[]) {
    console.log("day ticketssss", tickets);

    //get current and next 7 days
    const currentDate = new Date();
    const daysArray = [];
    const unresolvedCountArray = [];

    for (let i = 6; i >= 0; i--) {
        const pastDate = new Date(currentDate);
        pastDate.setDate(currentDate.getDate() - i);
        const day = pastDate.getDate();
        const month = pastDate.getMonth() + 1; // Note: Months are zero-based
        const year = pastDate.getFullYear();

        daysArray.push(day + '/' + month + '/' + year);
    }
    //get tickets not been resolved on each day


    for (const day of daysArray) {
      const [dd, mm, yyyy] = day.split('/').map(Number);
      const formattedDay = new Date(yyyy, mm - 1, dd);

      const unresolvedTicketsOnDay = tickets.filter((ticket: ticket) => {
          const ticketCreatedAt = new Date(ticket.createdAt);

          ticketCreatedAt.setHours(0, 0, 0, 0);
          formattedDay.setHours(0, 0, 0, 0);

          console.log('ticket Created at day: ', ticketCreatedAt);
          console.log('day day day is: ', formattedDay);
          return ticketCreatedAt <= formattedDay;
      });

      // Filter out unresolved tickets and also any tickets resolved only after this formatted date
      const unresolvedTicketsOnDayFiltered = unresolvedTicketsOnDay.filter(ticket => {
        if (ticket.timeToTicketResolution) {
          console.log('ticket dayyy time to resolution: ', ticket.timeToTicketResolution);
          const ticketResolvedDate = new Date(ticket.timeToTicketResolution);
          ticketResolvedDate.setHours(0, 0, 0, 0);
          console.log("Resolved on dayyyy: ", ticketResolvedDate + " ticket name: ", ticket.summary);
          return ticketResolvedDate > formattedDay;

        }
        return true;
      });

      console.log('On day: ', day, " the tickets that had been unresolved before this day are: ", unresolvedTicketsOnDayFiltered);

      // Count the number of unresolved tickets
      const unresolvedTicketCount = unresolvedTicketsOnDayFiltered.length;
      unresolvedCountArray.push(unresolvedTicketCount);

      console.log(`On ${day}: ${unresolvedTicketCount} unresolved tickets.`);
    }


    ///calculating the ideal time, taking into account number of initial tickets from the sprint
    const idealTicketsArray = [];
    const sprintLength = unresolvedCountArray.length;
    const maxUnresolvedTickets = Math.max(...unresolvedCountArray);
    const averageTicketsPerDay = Math.ceil(maxUnresolvedTickets / sprintLength);
    let remainingTickets = maxUnresolvedTickets;
    for (let i = 0; i < sprintLength; i++) {
      idealTicketsArray.push(remainingTickets);

      const resolvedTickets = Math.min(averageTicketsPerDay, remainingTickets);

      remainingTickets -= resolvedTickets;
    }


    ///updating chart

    this.burnDownChart.data.labels = daysArray;
    this.burnDownChart.data.datasets[0].data = unresolvedCountArray;
    this.burnDownChart.data.datasets[1].data = idealTicketsArray;
    // this.ticketVolumeTrendChart.data.datasets[1].data = resolutionTimeData;
    this.burnDownChart.update();
  }

  createBurnDownChart() {
    this.burnDownChart = new Chart(this.burnDownChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels : ["01-01-2017", "03-01-2017", "04-02-2017", "09-02-2017"],
        datasets: [
          {
            label: 'Actual Ticket Situation',
            data : [ 8, 7, 5, 7, 6, 5, 5 ],
            borderColor: 'rgba(26, 188, 156, 1)',
            backgroundColor: 'rgba(26, 188, 156, 0.2)',  // Change opacity to 0.2 for better visualization
            tension: 0,   // Slightly increase tension for smoother lines
            pointRadius: 5,
            pointHoverRadius: 6,
            pointBorderColor: '#fff',
            pointBackgroundColor: 'rgba(26, 188, 156, 1)',
            borderWidth: 2,   // Increase the line width for better visibility
          },
          {
            label: 'Ideal Ticket Situation',
            data : [ 8, 7, 5, 7, 6, 5, 5 ],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Change opacity to 0.2 for better visualization
            tension: 0,   // Slightly increase tension for smoother lines
            pointRadius: 5,
            pointHoverRadius: 6,
            pointBorderColor: '#fff',
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,    // Increase the line width for better visibility,
            fill: true,
          }
        ]
      },
      options: {
        responsive: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date'   // Add title to X-Axis
            }
          },
          y: {
            beginAtZero: true,
            display: true,
            title: {
              display: true,
              text: 'Ticket Volume'   // Add title to Y-Axis
            },
            ticks: {
              stepSize: 1,  // This will ensure the y-axis has a step size of 1
              precision: 0,  // This will set the precision to 0, effectively displaying only whole numbers,
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',  // Change legend position to bottom
            labels: {
              boxWidth: 20,   // Increase the boxWidth
              padding: 20     // Increase the padding
            }
          },
          tooltip: {  // Enable tooltips
            enabled: true,

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

    const maxTickets = Math.max(...createdTimeData, ...resolutionTimeData);
    const maxScaleValue = Math.max(10, maxTickets + 10);


    if (this.ticketVolumeTrendChart && this.ticketVolumeTrendChart.options && this.ticketVolumeTrendChart.options.scales && this.ticketVolumeTrendChart.options.scales['y']) {
      this.ticketVolumeTrendChart.options.scales['y'].max = maxScaleValue;
    }

    this.ticketVolumeTrendChart.data.labels = timeLabels;
    this.ticketVolumeTrendChart.data.datasets[0].data = createdTimeData;
    this.ticketVolumeTrendChart.data.datasets[1].data = resolutionTimeData;
    this.ticketVolumeTrendChart.update();
  }


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
                    borderColor: 'transparent' ,
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
              this.ActiveTicketsCount,
              this.PendingTicketsCount,
              this.personalClosedTicketsCount
            ],
            backgroundColor: ['rgba(46, 204, 113, 0.8)', 'rgba(241, 196, 15, 0.8)', 'rgba(231, 76, 60, 0.8)'],
           // borderWidth: 0,
            borderColor: 'transparent', // Remove the lines
            hoverBorderColor: '#fff' // white border on hover
          }
        ]
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            position: 'left',
            labels: {
              usePointStyle: true, // Use point styles for legend
              pointStyle: 'circle' // You can set this to any valid point style
            }
          },
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
        },

      }
    });
  }



  updatePolarChart(): void {
    this.polarChart.data.datasets[0].data = [
      this.ActiveTicketsCount,
      this.PendingTicketsCount,
      this.personalClosedTicketsCount
    ];
    this.polarChart.update();
  }
}

// export { AnalyticsPageComponents }
