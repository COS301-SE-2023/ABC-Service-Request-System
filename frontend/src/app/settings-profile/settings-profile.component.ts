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


  lineChart!: Chart<'line', (number | null)[], string>;
  ticketResolutionLineChart!: Chart<'line', (number | null)[], string>;
 // ticketVolumeTrendChart!: Chart<'line', (number | null)[], string>;

  @ViewChild('lineChartCanvas', { static: true }) lineChartCanvas!: ElementRef;
  @ViewChild('ticketResolutionLineChartCanvas', { static: true }) ticketResolutionLineChartCanvas!: ElementRef;
  numUpdates = 0;
  activeCounter = 0;


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
  private router: Router,  private ticketsService: TicketsService) {}

  isModalOpen = false;

  toggleModal(): void {
    // console.log('toggle modal');
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
              this.calculateAverageResponseTime(response);
              this.calculateAverageTimeToResolution(response);
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

  saveProfile() {
    console.log('in save profile()');
    this.profileChanged = false;
    this.bioEditable = false;
    this.socialsEditable = false;

    this.numUpdates = 0;
    this.activeCounter = 0;

    if (this.profilePicture) {
      this.numUpdates++;
    }
    if (this.profileHeader) {
      this.numUpdates++;
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
              alert('Profile picture updated');
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
              alert('Profile header updated');
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
          alert('Bio updated');
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
          alert('Github link updated');
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
          alert('LinkedIn link updated');
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
      this.toggleModal();
    }
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



}
