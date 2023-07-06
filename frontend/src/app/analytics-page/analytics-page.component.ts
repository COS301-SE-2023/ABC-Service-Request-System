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
      backgroundColor: ['green', 'yellow', 'red'], // Set colors for each priority level
    }]
  };
  

  polarChartData: ChartData<'polarArea', (number | null)[], string> = {
    labels: ['Open', 'Pending', 'Closed'],
    datasets: [{
      data: [0, 0, 0], // Initialize with no data
      backgroundColor: ['green', 'yellow', 'red'], // Set colors for each status
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
    this.timeToTicketResolutionData = [20, 25, 30, 35, 40, 45, 50]; // Mock data for personal "Time to Ticket Resolution"

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

    this.averageTimeHours = "2";
    this.averageTimeMinutes = "30";

    this.createLineChart();
    this.createTimeToTicketResolutionChart();

    this.ticketVolumeData = this.personalTicketVolumeData;
    this.doughnutChartData.datasets[0].data = [15, 25, 60];
    this.polarChartData.datasets[0].data = [10, 20, 70];

    this.createTicketVolumeChart();
    this.createPolarChart();

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
      const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Time to First Response',
            data: this.timeToFirstResponseData,
            fill: true,
            backgroundColor: 'rgba(100, 11, 192, 0.2)',
            borderColor: 'rgba(192, 75, 192, 1)',
            tension: 0.4
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
      const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Time to Ticket Resolution',
            data: this.timeToTicketResolutionData,
            fill: true,
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            tension: 0.4
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
      const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Ticket Volume Trend',
            data: this.ticketVolumeData,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.4
          }
        ]
      };
      const options = {
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          x: {
            display: true
          },
          y: {
            display: true
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
    const canvas = this.doughnutChartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    this.doughnutChart = new Chart<"doughnut", (number | null)[], string>(ctx, {
      type: 'doughnut',
      data: this.doughnutChartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  createPolarChart() {
    if (this.polarChart) { // If the chart has already been created, update it instead of creating a new one
      this.polarChart.data = this.polarChartData; // Update the chart's data
      this.polarChart.update(); // Trigger a re-render of the chart
    } else { // If the chart hasn't been created yet, create it
      if (this.polarChartCanvas) {
        const canvas = this.polarChartCanvas.nativeElement;
        const ctx = canvas.getContext('2d');
  
        this.polarChart = new Chart<"polarArea", (number | null)[], string>(ctx, {
          type: 'polarArea',
          data: this.polarChartData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
          },
        });
      }
    }
  }

}
