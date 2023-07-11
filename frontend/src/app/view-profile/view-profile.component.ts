import { Component, OnInit,  ViewChild, ElementRef} from '@angular/core';
import { UserService } from 'src/services/user.service';
import { user } from '../../../../backend/src/models/user.model';
import { AuthService } from 'src/services/auth.service';
import { Chart, registerables, ChartData, ChartOptions } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  firstTimeName!: string;
  firstTimeSurname!:string;
  user!: user;
  profilePicture!: File;
  backgroundPicture!: File;
  userPic!: string;

  selectedAnalyticsType = 'personal';
  selectedGroup = 'group1';
  overdueTicketsCount!: number;
  groups: string[] = [];

  ticketsDueTodayCount!: number;
  openTicketsCount!: number;
  pendingTicketsCount!: number;
  averageTimeToFirstResponse!: string;
  timeToFirstResponseData!: number[];

  loggedHoursData!: any[];
  personalLoggedHoursData!: any[];
  groupLoggedHoursData: { [key: string]: any[] } = {};

  chart!: Chart;
  resolutionChart!: Chart;
  ticketVolumeChart!: Chart;
  doughnutChart!: Chart<"doughnut", (number | null)[], string>;
  polarChart!: Chart<"polarArea", (number | null)[], string>;



  personalOverdueTicketsCount: number;
  personalTicketsDueTodayCount: number;
  personalOpenTicketsCount: number;
  personalPendingTicketsCount: number;
  personalTimeToFirstResponseData: number[];

  personalAverageTimeToFirstResponse!: string;
  group1AverageTimeToFirstResponse!: string;
  group2AverageTimeToFirstResponse!: string;
  group3AverageTimeToFirstResponse!: string;

  timeToTicketResolutionData!: number[];

  averageTimeResolution!: string;
  averageTimeHours!: string;
  averageTimeMinutes!: string;

  group1averageTimeResolution!: string;
  group1averageTimeHours!: string;
  group1averageTimeMinutes!: string;

  group2averageTimeResolution!: string;
  group2averageTimeHours!: string;
  group2averageTimeMinutes!: string;

  group3averageTimeResolution!: string;
  group3averageTimeHours!: string;
  group3averageTimeMinutes!: string;

  // Mock data for Ticket Volume Trend
  personalTicketVolumeData: number[] = [12, 19, 3, 5, 2, 3, 7];
  group1TicketVolumeData: number[] = [15, 29, 5, 10, 6, 4, 8];
  group2TicketVolumeData: number[] = [10, 14, 7, 8, 2, 6, 4];
  group3TicketVolumeData: number[] = [5, 10, 4, 6, 2, 3, 5];

  ticketVolumeData!: number[];

  @ViewChild('lineChart', { static: true }) lineChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('timeToTicketResolutionChart', { static: true }) timeToTicketResolutionChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ticketVolumeChart', { static: true }) ticketVolumeChartElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutChartByPriorityCanvas', { static: true }) doughnutChartCanvas!: ElementRef;
  @ViewChild('polarChartCanvas', { static: true }) polarChartCanvas!: ElementRef;

  constructor(private userService: UserService, private authService: AuthService) {

    this.personalOverdueTicketsCount = 10;
    this.personalTicketsDueTodayCount = 5;
    this.personalOpenTicketsCount = 15;
    this.personalPendingTicketsCount = 8;
    this.personalAverageTimeToFirstResponse = '37';
    this.group1AverageTimeToFirstResponse = '42';
    this.group2AverageTimeToFirstResponse = '45';
    this.group3AverageTimeToFirstResponse = '40';
    this.personalTimeToFirstResponseData = [30, 40, 35, 45, 50, 38, 42];

    this.personalLoggedHoursData = [
      { ticketDescription: 'Update personal tasks', timeTaken: '2 hours' },
      { ticketDescription: 'Fix personal bugs', timeTaken: '1.5 hours' },
      { ticketDescription: 'Develop personal projects', timeTaken: '3 hours' }
    ];

    this.groupLoggedHoursData = {
      group1: [
        { ticketDescription: 'Design new group1 interface', timeTaken: '1.5 hours' },
        { ticketDescription: 'Create group1 database schema', timeTaken: '2 hours' },
        { ticketDescription: 'Develop group1 backend API', timeTaken: '3 hours' }
      ],
      group2: [
        { ticketDescription: 'Bug fix in the group2 interface', timeTaken: '1 hour' },
        { ticketDescription: 'Create group2 unit tests', timeTaken: '2 hours' },
        { ticketDescription: 'Group2 integration testing', timeTaken: '1.5 hours' }
      ],
      group3: [
        { ticketDescription: 'Implement group3 CI/CD', timeTaken: '3 hours' },
        { ticketDescription: 'Group3 code review', timeTaken: '2 hours' },
        { ticketDescription: 'Plan group3 sprint', timeTaken: '1 hour' }
      ]
    };

    
    this.setPersonalData();
  }

  setPersonalData() {
    this.averageTimeResolution = '37';
    this.averageTimeToFirstResponse = this.personalAverageTimeToFirstResponse;
    this.overdueTicketsCount = this.personalOverdueTicketsCount;
    this.ticketsDueTodayCount = this.personalTicketsDueTodayCount;
    this.openTicketsCount = this.personalOpenTicketsCount;
    this.pendingTicketsCount = this.personalPendingTicketsCount;
    this.averageTimeToFirstResponse = this.personalAverageTimeToFirstResponse;
    this.timeToFirstResponseData = this.personalTimeToFirstResponseData;
    this.loggedHoursData = this.personalLoggedHoursData; // Use personalLoggedHoursData

    this.averageTimeHours = "02";
    this.averageTimeMinutes = "30";

    this.createLineChart();

    this.timeToTicketResolutionData = [20, 25, 30, 35, 40, 45, 50]; // Mock data for personal "Time to Ticket Resolution"
    this.createTimeToTicketResolutionChart();

    this.ticketVolumeData = this.personalTicketVolumeData;

    this.createTicketVolumeChart();

  }

  updateGroupTicketResolutionData() {
    if (this.selectedGroup === 'group1') {
      this.timeToTicketResolutionData = [45, 40, 30, 20, 35, 40, 45]; // Mock data for group1 "Time to Ticket Resolution"
    } else if (this.selectedGroup === 'group2') {
      this.timeToTicketResolutionData = [25, 35, 40, 30, 25, 20, 15]; // Mock data for group2 "Time to Ticket Resolution"
    } else if (this.selectedGroup === 'group3') {
      this.timeToTicketResolutionData = [30, 20, 25, 15, 10, 5, 0]; // Mock data for group3 "Time to Ticket Resolution"
    } else {
      // If selected group is not available, use personal "Time to Ticket Resolution" data
      this.timeToTicketResolutionData = [20, 30, 35, 25, 40, 45, 50]; // Mock data for personal "Time to Ticket Resolution"
    }

    this.createTimeToTicketResolutionChart();
  }

  updateGroupData() {
    if (this.selectedGroup === 'group1') {
      this.overdueTicketsCount = 5;
      this.ticketsDueTodayCount = 2;
      this.openTicketsCount = 8;
      this.pendingTicketsCount = 3;
      this.averageTimeToFirstResponse = this.group1AverageTimeToFirstResponse;
      this.averageTimeHours = "01";
      this.averageTimeMinutes = "15"; 
      // this.ticketVolumeData = this.group1TicketVolumeData;
    } else if (this.selectedGroup === 'group2') {
      this.averageTimeToFirstResponse = this.group2AverageTimeToFirstResponse;
      // this.ticketVolumeData = this.group2TicketVolumeData;
      this.overdueTicketsCount = 7;
      this.ticketsDueTodayCount = 3;
      this.openTicketsCount = 10;
      this.pendingTicketsCount = 5;
      this.averageTimeHours = "00";
      this.averageTimeMinutes = "30";
    } else if (this.selectedGroup === 'group3') {
      this.averageTimeToFirstResponse = this.group3AverageTimeToFirstResponse;
      // this.ticketVolumeData = this.group3TicketVolumeData;
      this.overdueTicketsCount = 3;
      this.ticketsDueTodayCount = 1;
      this.openTicketsCount = 6;
      this.pendingTicketsCount = 2;
      this.averageTimeHours = "00";
      this.averageTimeMinutes = "45";
    } else {
      // If selected group is not available, set personal analytics data
      this.setPersonalData();
    }

    if (Object.prototype.hasOwnProperty.call(this.groupLoggedHoursData, this.selectedGroup)) {
      const groupData = this.groupLoggedHoursData[this.selectedGroup];
      this.loggedHoursData = groupData.map((item: any) => ({
        ticketDescription: item.ticketDescription,
        timeTaken: item.timeTaken
      }));
      this.timeToFirstResponseData = this.getGroupTimeToFirstResponseData(this.selectedGroup);
    } else {
      this.loggedHoursData = this.personalLoggedHoursData;
      this.timeToFirstResponseData = this.personalTimeToFirstResponseData; // Use the personalTimeToFirstResponseData
    }
    this.createTimeToTicketResolutionChart();
    this.createLineChart();
    this.updateTicketVolumeData();

  }

  getGroupTimeToFirstResponseData(group: string): number[] {
    switch (group) {
      case 'group1':
        return [0, 45, 40, 50, 55, 43, 48]; // Mock data for group1
      case 'group2':
        return [10, 60, 20, 50, 52, 40, 45]; // Mock data for group2
      case 'group3':
        return [33, 43, 38, 38, 36, 12, 46]; // Mock data for group3
      default:
        return [];
    }
  }

  onAnalyticsTypeChange() {
    if (this.selectedAnalyticsType === 'personal') {
      this.setPersonalData();
    } else if (this.selectedAnalyticsType === 'group') {
      this.updateGroupData();
      this.updateGroupTicketResolutionData();
    }
  }

  onGroupChange() {
    if (this.selectedAnalyticsType === 'group') {
      this.updateGroupData();
      this.updateGroupTicketResolutionData();
      this.updateTicketVolumeData();
    }
  }

  updateTicketVolumeData() {
    if (this.selectedGroup === 'group1') {
      this.ticketVolumeData = this.group1TicketVolumeData;
    } else if (this.selectedGroup === 'group2') {
      this.ticketVolumeData = this.group2TicketVolumeData;
    } else if (this.selectedGroup === 'group3') {
      this.ticketVolumeData = this.group3TicketVolumeData;
    } else {
      this.ticketVolumeData = this.personalTicketVolumeData;
    }
  
    this.createTicketVolumeChart();
  }

  createLineChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.lineChart && this.lineChart.nativeElement) {
      const ctx: CanvasRenderingContext2D = this.lineChart.nativeElement.getContext('2d')!;
      
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(199, 245, 211, 0)'); // Light Green
      gradient.addColorStop(0.7, 'rgba(199, 245, 211, 0)'); // Light Green
      
      const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            fillColor : gradient,
            label: 'Time to First Response',
            data: this.timeToFirstResponseData,
            fill: true,
            backgroundColor: gradient,
            borderColor: 'rgba(26, 188, 156, 1)', // Solid Green
            tension: 0.2, // A bit smoother line
            pointRadius: 5, // Larger points
            pointHoverRadius: 7, // Even larger points on hover
            pointBorderColor: '#fff', // White points
            pointBackgroundColor: 'rgba(26, 188, 156, 1)' // Green points
          }
        ]
      };
      const options = {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: false
          },
          y: {
            display: false
          }
        }
      };
  
      this.chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
      });
    }
  }

  createTimeToTicketResolutionChart() {
    if (this.resolutionChart) {
      this.resolutionChart.destroy();
    }
  
    if (this.timeToTicketResolutionChart && this.timeToTicketResolutionChart.nativeElement) {
      const ctx: CanvasRenderingContext2D = this.timeToTicketResolutionChart.nativeElement.getContext('2d')!;
      
      // Create gradient for background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, 300);
      bgGradient.addColorStop(0, 'rgba(246, 204, 203, 0)'); // Lighter orange
      bgGradient.addColorStop(1, 'rgba(246, 204, 203, 0)'); // Darker orange
  
  
      const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Time to Ticket Resolution',
            data: this.timeToTicketResolutionData,
            fill: true,
            backgroundColor: bgGradient, // Gradient background
            borderColor: 'rgba(255, 91, 91, 0.66)',
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBorderColor: '#fff',
            pointBackgroundColor: 'rgba(255, 91, 91, 1)'
          }
        ]
      };
  
      const options = {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: false,
            grid: {
              drawBorder: false,
              display: false
            },
            ticks: {
              display: false
            }
          },
          y: {
            display: false,
            grid: {
              drawBorder: false,
              color: 'rgba(0,0,0,0.1)',
              borderDash: [5, 5]
            },
            ticks: {
              display: false
            }
          }
        }
      };
  
      this.resolutionChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
      });
    }
  }

  createTicketVolumeChart() {
    if (this.ticketVolumeChart) {
      this.ticketVolumeChart.destroy();
    }
  
    if (this.ticketVolumeChartElement && this.ticketVolumeChartElement.nativeElement) {
      const ctx: CanvasRenderingContext2D = this.ticketVolumeChartElement.nativeElement.getContext('2d')!;
  
      // Create gradient for background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, 400);
      bgGradient.addColorStop(0, 'rgba(123, 64, 242, 0.2)'); // Lighter Purple
      bgGradient.addColorStop(1, 'rgba(67, 30, 139, 0.2)'); // Darker Purple
  
      // Create gradient for border
      const borderGradient = ctx.createLinearGradient(0, 0, 0, 400);
      borderGradient.addColorStop(0, 'rgba(123, 64, 242, 1)'); // Lighter Purple
      borderGradient.addColorStop(1, 'rgba(67, 30, 139, 1)'); // Darker Purple
  
      const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Ticket Volume Trend',
            data: this.ticketVolumeData,
            fill: true,
            backgroundColor: bgGradient, // Gradient background
            borderColor: borderGradient, // Gradient border
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgba(67, 30, 139, 1)'
          }
        ]
      };
      
      const options = {
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 14,
                weight: 'bold',
                family: 'Arial'
              },
              color: '#666'
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: '#666',
              font: {
                size: 12
              }
            }
          },
          y: {
            display: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: '#666',
              font: {
                size: 12
              }
            }
          }
        }
      };
  
      this.ticketVolumeChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
      });
    }
  }
  getUser(userId: string) {

    this.userService.getUser(userId).subscribe(
      (user: user) => {
        this.user = user;
        //console.log(this.user);
        this.firstTimeName = user.name;
        this.firstTimeSurname = user.surname;
      },

      (error: any) => {
        console.error(error);
      }
    );

  }

  ngOnInit() {
    const userId = this.getUserObject().id; // Replace with the actual user ID
    this.getUser(userId);
   console.log("hi");
   this.RenderChart();
   this.createLineChart();
   this.createTimeToTicketResolutionChart();
   this.createTicketVolumeChart();
   this.userService.getUser(userId).subscribe((user: user)=>{
   this.user = user;
   });

   this.userPic = this.getUsersProfilePicture();
 }

 getUsersProfilePicture(){
  const user = this.authService.getUser();
  console.log("userrr", user);
  console.log("profile photo: " + user.profilePhoto);
  return this.user.profilePhoto;
}

getUsersBackgroundPicture(){
  // const user = this.authService.getUser();
  // console.log("userrr", user);
  // console.log("background photo: " + user.backgroundPhoto);
  // return this.user.BackgroundPhoto;
}

getUsersBio(){
  // const user = this.authService.getUser();
  // console.log("userrr", user);
  // console.log("bio: " + user.bio);
  // return this.user.bio;
}

getUserObject(){
  return this.authService.getUser();
}



RenderChart() {
  const myChart = new Chart("piechart", {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'April', 'May'],
      datasets: [{
        label: '# of tickets completed',
        data: [12, 10, 17, 20, 5],
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Optional: Add a background color to the bars
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

}
}
