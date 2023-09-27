import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { UserService } from 'src/services/user.service';
import { user } from "../../../../backend/users/src/models/user.model";
import { AuthService } from 'src/services/auth.service';
import { GroupService } from 'src/services/group.service';
import { group } from '../../../../backend/groups/src/models/group.model';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from 'src/services/navbar.service';
import { AnalyticsPageComponent } from '../analytics-page/analytics-page.component';
import { Chart } from 'chart.js';
import { ticket } from '../../../../backend/tickets/src/models/ticket.model';
import { TicketsService } from 'src/services/ticket.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.scss']
})
export class SettingsProfileComponent { // implements OnInit{

  currentUser!: user;
  tempUser!:user;
  groupIds: string[] = [];
  groups: group[] = [];
  headerPhoto = '';
  profileChanged = false;
  bioEditable = false;
  socialsEditable = false;

  profilePicture?: File;
  profileHeader?: File;
  userBio?: string;
  githubLink?: string;
  linkedinLink?: string;
  oldGithubLink?:string;
  oldLinkedinLink?:string;
  oldUserBio?:string;

  navbarIsCollapsed!: boolean;

  userId!: string;

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
  currentTickets!: ticket[];
  uploadFlag = false;
  uploadHeaderFlag = false;

  timeToFirstResponseArray: ticket[] = [];
  timeToTicketResolutionArray: ticket [] = [];

  responsePercentChange = 0;
  resolutionPercentChange = 0;

  responseTrend!: string;
  resolutionTrend!: string;

  responsePercentChangeAbs = 0;
  resolutionPercentChangeAbs = 0;


  lineChart!: Chart<'line', (number | null)[], string>;
  ticketResolutionLineChart!: Chart<'line', (number | null)[], string>;
 // ticketVolumeTrendChart!: Chart<'line', (number | null)[], string>;

  @ViewChild('lineChartCanvas', { static: true }) lineChartCanvas!: ElementRef;
  @ViewChild('ticketResolutionLineChartCanvas', { static: true }) ticketResolutionLineChartCanvas!: ElementRef;
  numUpdates = 0;
  activeCounter = 0;

  headerPhotoPreview?: string;
  profilePhotoPreview?: string;

  makeBioEditable() {
    this.bioEditable = true;
    this.profileChanged = true;
  }

  makeSocialsEditable() {
    this.socialsEditable = true;
    this.profileChanged = true;
  }

  constructor(private userService: UserService, private authService: AuthService,
  private groupService: GroupService, private cdr: ChangeDetectorRef, private navbarService: NavbarService,
  private router: Router,  private ticketsService: TicketsService, private snackBar: MatSnackBar) {}

  isModalOpen = false;

  toggleModal(): void {
    // console.log('toggle modal');
    if (!this.isModalOpen) {
      this.headerPhotoPreview = this.currentUser.headerPhoto;
      this.profilePhotoPreview = this.currentUser.profilePhoto;
    } else {
      this.currentUser.headerPhoto = this.headerPhotoPreview!;
      this.currentUser.profilePhoto = this.profilePhotoPreview!;
    }

    this.isModalOpen = !this.isModalOpen;
  }


  ngOnInit(): void {
    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
    });

    this.authService.getUserObject().subscribe(
      (result: any) => {
        this.currentUser = result;
        this.groupIds = this.currentUser.groups;
        this.githubLink = this.currentUser.github;
        this.linkedinLink = this.currentUser.linkedin;
        this.oldGithubLink = this.githubLink;
        this.oldLinkedinLink = this.linkedinLink;
        this.userBio = this.currentUser.bio;
        this.oldUserBio = this.userBio;
        // console.log(this.currentUser.groups, ' in ngoninit ');
        if (this.lineChart) {
          this.lineChart.destroy();
        }

        if (this.ticketResolutionLineChart) {
          this.ticketResolutionLineChart.destroy();
        }

        console.log(this.currentUser.groups);
        this.currentUser.groups.forEach(groupId => {
          this.groupService.getGroupById(groupId).subscribe(group => {
            this.groups.push(group);
            console.log('hellooo');
            this.createLineChart();
            this.createTicketResolutionLineChart();
          });
        });

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
          (response) => {
            console.log(response);
            this.currentTickets = response;

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

              this.updateLineChart(response);
              this.updateTicketResolutionLineChart(response);
              // this.updateTicketVolumeTrendChart(response);
              this.sortResponseTimeTickets(response);
              this.sortResolutionTimeTickets(response);
          }, (error) => {
            console.log("Error fetching tickets for current user", error);
          }
        );
      }
    );
  }

  @ViewChild('fileUploader')
  fileUploader!: ElementRef;

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];

      // Show preview
      const reader = new FileReader();
      reader.onload = e => {
        if (typeof reader.result === 'string') {
          this.currentUser.profilePhoto = reader.result;
          this.profilePicture = file;
        }
      };
      this.profileChanged = true;
      reader.readAsDataURL(file);
    }
  }

  @ViewChild('headerInput')
  headerInput!: ElementRef;

  onHeaderChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];

      // Show preview
      const reader = new FileReader();
      reader.onload = e => {
        if (typeof reader.result === 'string') {
          this.currentUser.headerPhoto = reader.result;
          this.profileHeader = file;
        }
      };
      this.profileChanged = true;
      reader.readAsDataURL(file);
    }
    // this.currentUser.headerPhoto = newImageUrl;
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
    });
  }

  @ViewChild('headerFileUploader')
  headerFileUploader!: ElementRef;

  onHeaderFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];

      // Show preview
      const reader = new FileReader();
      reader.onload = e => {
        if (typeof reader.result === 'string') {
          this.currentUser.headerPhoto = reader.result;
          this.profileHeader = file;
        }
      };
      this.profileChanged = true;
      reader.readAsDataURL(file);
    }
  }

  profilePicChanged = false;
  profileHeadChanged = false;
  saveProfile() {
    console.log('in save profile()');
    this.profileChanged = false;
    this.bioEditable = false;
    this.socialsEditable = false;

    this.numUpdates = 0;
    this.activeCounter = 0;
    this.uploadFlag = false;

    if (this.profilePicture) {
      this.profilePicChanged = true;
    }
    if (this.profileHeader) {
      this.profileHeadChanged = true;
    }
    if (this.githubLink && (this.githubLink != this.oldGithubLink)){
      this.numUpdates++;
    }
    if (this.userBio && (this.userBio != this.oldUserBio)) {
      this.numUpdates++;
    }
    if (this.linkedinLink && (this.linkedinLink != this.oldLinkedinLink)) {
      this.numUpdates++;
    }

    if (this.profilePicture) {
      this.activeCounter++;
      this.userService.uploadFile(this.profilePicture).subscribe(
        (result:any) => {
          const url = result.url;
          // console.log(url);
          this.userService.updateProfilePicture(this.currentUser.id, url).subscribe(
            (result:any) => {
              console.log(result);
              this.currentUser.profilePhoto = url;
              this.authService.updateUserData(this.currentUser);  // update local user data
              this.cdr.detectChanges();  // force Angular to re-render the component
              this.authService.getUserObject().subscribe(
                (result: any) => {
                  this.currentUser = result;
                  console.log(this.currentUser);
                }
              )
              this.profilePicture = undefined;
              // this.showSnackBar('Profile updated');
              // if (this.profileHeadChanged === false) {
              //   // this.toggleModal();
              // }
              // this.uploadFlag = true;
              // if (this.uploadFlag == true) {
              //   this.toggleModal();
              //   this.showSnackBar('Profile updated');
              // }
            },
            (error: any) => {
              console.log('Error updating profile picture', error);
            }
          )
        },
        (error: any) => {
          console.log('Error uploading file', error);
        }
      )
    }

    if (this.profileHeader) {
      this.activeCounter++;
      this.userService.uploadFile(this.profileHeader).subscribe(
        (result:any) => {
          const url = result.url;
          this.userService.updateProfileHeader(this.currentUser.id, url).subscribe(
            (result:any) => {
              console.log(result);
              this.currentUser.headerPhoto = url;
              this.authService.updateUserData(this.currentUser);  // update local user data
              this.cdr.detectChanges();  // force Angular to re-render the component
              this.authService.getUserObject().subscribe(
                (result: any) => {
                  this.currentUser = result;
                }
              )
              this.profileHeader = undefined;

              // this.uploadHeaderFlag = true;
              // if (this.uploadFlag != true && this.uploadHeaderFlag == true) {
              //   this.toggleModal();
              //   this.showSnackBar('Profile updated');
              // }
            },
            (error: any) => {
              console.log('Error updating profile picture', error);
            }
          )
        },
        (error: any) => {
          console.log('Error uploading file', error);
        }
      )
    }

    if (this.userBio && (this.userBio != this.oldUserBio)) {
      this.activeCounter++;
      this.userService.updateBio(this.currentUser.id, this.userBio).subscribe(
        (result:any) => {
          console.log(result);
          this.currentUser.bio = this.userBio!;
          this.authService.updateUserData(this.currentUser);
          // this.userBio = undefined;
          this.oldUserBio = this.userBio;
          // alert('Bio updated');
          // this.showSnackBar('Profile updated');
        },
        (error: any) => {
          console.log('Error updating bio', error);
        }
      )
    }

    if (this.githubLink && (this.githubLink != this.oldGithubLink)) {
      this.activeCounter++;
      this.userService.updateGithub(this.currentUser.id, this.githubLink).subscribe(
        (result:any) => {
          console.log(result);
          this.currentUser.github = this.githubLink!;
          this.authService.updateUserData(this.currentUser);
          this.oldGithubLink = this.githubLink;
          // alert('Github link updated');
          // this.showSnackBar('Profile updated');
        },
        (error: any) => {
          console.log('Error updating Github link', error);
        }
      )
    }

    if (this.linkedinLink && (this.linkedinLink != this.oldLinkedinLink)) {
      this.activeCounter++;
      this.userService.updateLinkedin(this.currentUser.id, this.linkedinLink).subscribe(
        (result:any) => {
          console.log(result);
          this.currentUser.linkedin = this.linkedinLink!;
          this.authService.updateUserData(this.currentUser);
          // this.linkedinLink = undefined;
          this.oldLinkedinLink = this.linkedinLink;
          // alert('LinkedIn link updated');
          // this.showSnackBar('Profile updated');
        },
        (error: any) => {
          console.log('Error updating LinkedIn link', error);
        }
      )
    }

    console.log('numupdates ' + this.numUpdates);
    console.log('active counter: ' + this.activeCounter);
    if (this.activeCounter === this.numUpdates) {
      console.log('this.activeCounter === this.numUpdates');
    }

    if (this.activeCounter > 0) {
      this.toggleModal();
      this.showSnackBar('Profile updated');
    }

  }

  createTicketResolutionLineChart(): void {
    if (this.ticketResolutionLineChart) {
      this.ticketResolutionLineChart.destroy();
    }

    const trendColour = this.calculateResolutionTrend();
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

  createLineChart(): void {
    if (this.lineChart) {
      this.lineChart.destroy();
    }

    const trendColour = this.calculateResponseTrend();
    this.lineChart = new Chart(this.lineChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'minutes: ',
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
    const tempTickets = tickets.filter(ticket => ticket.timeToFirstResponse);
  
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
    let trendColor = 'rgb(0, 196, 255 , 1)';

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
            trendColor = 'rgba(255, 85, 85, 1)'; // Negative trend
            console.log("trendColour Response", trendColor);
        } else {
            // console.log("Neutral Response trend: 0% change");
            this.responseTrend = 'neutral';
            trendColor = 'rgb(0, 196, 255 , 1)'; // Neutral trend
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
    let trendColor = 'rgb(0, 196, 255 , 1)';  // Neutral color

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
            trendColor = 'rgba(255, 85, 85, 1)';  // Negative trend
        } else if (this.resolutionPercentChange < 0) {
            // console.log(`Positive Resolution trend: ${Math.abs(percentageChange)}% improvement`);
            this.resolutionTrend = "positive";
            trendColor = 'rgba(26, 188, 156, 1)';  // Positive trend
        } else {
            // console.log("Neutral Resolution trend: 0% change");
            this.resolutionTrend = "neutral";
            trendColor = 'rgb(0, 196, 255 , 1)';
        }

        console.log("trendColour Resolution", trendColor);
    }

    return trendColor;  // This will return one of the colors: "gray", "green", or "red"
  }

  getArrowResolutionClass(): string {
    switch(this.resolutionTrend ) {
        case 'positive': return "fa-solid fa-arrow-trend-down";  // Assuming arrow down indicates improvement
        case 'negative': return "fa-solid fa-arrow-trend-up";    // Arrow up for worsening trend
        default: return 'fa-solid fa-minus';               // Horizontal line for neutral trend
    }
  }

  calculateResponseTrendCSS(): string {
    // Default color for insufficient data
    let trendColor = 'rgb(0, 196, 255 , 1)';

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
    let trendColor = 'rgb(0, 196, 255 , 1)';  // Neutral color

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




  formatTimeValue(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  routeToAnalytics(): void {
    this.router.navigateByUrl('/analytics-page');
  }

  updateLineChart(tickets: any[]): void {
    // clear previous data
    if (this.lineChart) {
      this.lineChart.destroy();
      this.createLineChart();
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
    const trendColor = this.calculateResponseTrend();
    this.lineChart.data.datasets[0].borderColor = trendColor;
    this.lineChart.data.datasets[0].backgroundColor = trendColor;
    this.lineChart.data.datasets[0].pointBackgroundColor = trendColor;

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
    const trendColor = this.calculateResolutionTrend();
    // console.log ("Updated Resolution trendColor", trendColor)
    this.ticketResolutionLineChart.data.datasets[0].borderColor = trendColor;
    this.ticketResolutionLineChart.data.datasets[0].backgroundColor = trendColor;
    this.ticketResolutionLineChart.data.datasets[0].pointBackgroundColor = trendColor;


    this.ticketResolutionLineChart.update();
  }



}
