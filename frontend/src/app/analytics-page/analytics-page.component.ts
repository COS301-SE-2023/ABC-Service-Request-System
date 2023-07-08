import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit {
  selectedAnalyticsType = 'personal';
  selectedGroup = 'group1';
  overdueTicketsCount!: number;
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

  //Mock data for Ticket Priority
  doughnutChartData: ChartData<'doughnut', (number | null)[], string> = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [{
      data: [20, 30, 50], // Replace with your actual data
      backgroundColor: [], // Set colors for each priority level
    }]
  };
  

  polarChartData: ChartData<'polarArea', (number | null)[], string> = {
    labels: ['Open', 'Pending', 'Closed'],
    datasets: [{
      data: [0, 0, 0], // Initialize with no data
      borderWidth: 0,
    }]
  };



  @ViewChild('lineChart', { static: true }) lineChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('timeToTicketResolutionChart', { static: true }) timeToTicketResolutionChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ticketVolumeChart', { static: true }) ticketVolumeChartElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutChartByPriorityCanvas', { static: true }) doughnutChartCanvas!: ElementRef;
  @ViewChild('polarChartCanvas', { static: true }) polarChartCanvas!: ElementRef;

  constructor() {
    // Mock data for personal analytics
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
    this.doughnutChartData.datasets[0].data = [15, 25, 60];
    this.polarChartData.datasets[0].data = [10, 20, 70];

    this.createTicketVolumeChart();
    this.createPolarChart();
    this.createDoughnutChart();

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
      this.doughnutChartData.datasets[0].data = [10, 35, 55];
      this.polarChartData.datasets[0].data = [15, 25, 60]; 
      // this.ticketVolumeData = this.group1TicketVolumeData;
    } else if (this.selectedGroup === 'group2') {
      this.averageTimeToFirstResponse = this.group2AverageTimeToFirstResponse;
      this.doughnutChartData.datasets[0].data = [25, 30, 45];
      this.polarChartData.datasets[0].data = [20, 30, 50];
      // this.ticketVolumeData = this.group2TicketVolumeData;
      this.overdueTicketsCount = 7;
      this.ticketsDueTodayCount = 3;
      this.openTicketsCount = 10;
      this.pendingTicketsCount = 5;
      this.averageTimeHours = "00";
      this.averageTimeMinutes = "30";
    } else if (this.selectedGroup === 'group3') {
      this.averageTimeToFirstResponse = this.group3AverageTimeToFirstResponse;
      this.doughnutChartData.datasets[0].data = [30, 20, 50];
      this.polarChartData.datasets[0].data = [10, 40, 50];
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
    this.doughnutChart.update();
    this.createPolarChart();

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

  ngAfterViewInit() {
    this.createLineChart();
    this.createTimeToTicketResolutionChart();
    this.createTicketVolumeChart();
    this.createDoughnutChart();
    this.createPolarChart();
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


createDoughnutChart() {
  if (this.doughnutChart) {
    this.doughnutChart.data = this.doughnutChartData;
    this.doughnutChart.update();
  } else {
    if (this.doughnutChartCanvas) {
      const canvas = this.doughnutChartCanvas.nativeElement;
      const ctx = canvas.getContext('2d');

      // Create three gradient colors
      const gradientLow = ctx.createLinearGradient(0, 0, 0, 400);
      gradientLow.addColorStop(0, 'rgba(26, 188, 156, 1)');
      gradientLow.addColorStop(1, 'rgba(22, 160, 133, 0.4)');
      
      const gradientMedium = ctx.createLinearGradient(0, 0, 0, 400);
      gradientMedium.addColorStop(0, 'rgba(241, 196, 15, 1)');
      gradientMedium.addColorStop(1, 'rgba(243, 156, 18, 0.4)');
      
      const gradientHigh = ctx.createLinearGradient(0, 0, 0, 400);
      gradientHigh.addColorStop(0, 'rgba(231, 76, 60, 0.8)');
      gradientHigh.addColorStop(1, 'rgba(192, 57, 43, 0.4)');
      
      this.doughnutChartData.datasets[0].backgroundColor = [gradientLow, gradientMedium, gradientHigh];

      this.doughnutChart = new Chart<"doughnut", (number | null)[], string>(ctx, {
        type: 'doughnut',
        data: this.doughnutChartData,
        options: {
          responsive: true,
          cutout: '50%', // You can adjust this value to decrease the thickness
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            }
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        },
      });
    }
  }
}

  createPolarChart() {
      if (this.polarChart) { 
          this.polarChart.data = this.polarChartData; 
          this.polarChart.update(); 
      } else { 
          if (this.polarChartCanvas) {
              const canvas = this.polarChartCanvas.nativeElement;
              const ctx = canvas.getContext('2d');

              const openGradient = ctx.createLinearGradient(0, 0, 0, 400);
              openGradient.addColorStop(0, 'rgba(46, 204, 113, 0.8)'); // Light Green
              openGradient.addColorStop(1, 'rgba(39, 174, 96, 0.4)'); // Darker Green

              const pendingGradient = ctx.createLinearGradient(0, 0, 0, 400);
              pendingGradient.addColorStop(0, 'rgba(241, 196, 15, 0.8)'); // Light Yellow
              pendingGradient.addColorStop(1, 'rgba(243, 156, 18, 0.4)'); // Darker Yellow

              const closedGradient = ctx.createLinearGradient(0, 0, 0, 400);
              closedGradient.addColorStop(0, 'rgba(231, 76, 60, 0.8)'); // Light Red
              closedGradient.addColorStop(1, 'rgba(192, 57, 43, 0.4)'); // Darker Red

              this.polarChartData.datasets[0].backgroundColor = [openGradient, pendingGradient, closedGradient];

              this.polarChart = new Chart<"polarArea", (number | null)[], string>(ctx, {
                  type: 'polarArea',
                  data: this.polarChartData,
                  options: {
                      responsive: true,
                      plugins: {
                          legend: {
                              position: 'bottom',
                          },
                          tooltip: {
                              backgroundColor: 'rgba(0,0,0,0.7)', // Dark tooltips for contrast
                              titleColor: 'white',
                              bodyColor: 'white',
                          },
                      },
                      scales: {
                          r: {
                              beginAtZero: true,
                              grid: {
                                  color: 'rgba(0, 0, 0, 0.1)', // Dark grid lines for a sleek look
                              },
                              ticks: {
                                  backdropColor: 'rgba(0, 0, 0, 0)', // Hide radial scale backdrop
                                  color: 'white', // White tick labels for contrast
                              },
                          },
                      },
                  },
              });
          }
      }
  }
}
