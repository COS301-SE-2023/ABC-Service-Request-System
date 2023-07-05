import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent {
  selectedAnalyticsType!: string;
  selectedGroup!: string;
  overdueTicketsCount!: number;
  ticketsDueTodayCount!: number;
  openTicketsCount!: number;
  pendingTicketsCount!: number;
  averageTimeToFirstResponse!: string;
  timeToFirstResponseData!: number[];
  

  personalOverdueTicketsCount: number;
  personalTicketsDueTodayCount: number;
  personalOpenTicketsCount: number;
  personalPendingTicketsCount: number;
  personalAverageTimeToFirstResponse: string;
  personalTimeToFirstResponseData: number[];

  @ViewChild('lineChart', { static: true }) lineChart!: ElementRef<HTMLCanvasElement>;


  constructor() {
    // Mock data for personal analytics
    this.personalOverdueTicketsCount = 10;
    this.personalTicketsDueTodayCount = 5;
    this.personalOpenTicketsCount = 15;
    this.personalPendingTicketsCount = 8;
    this.personalAverageTimeToFirstResponse = '37 mins';
    this.personalTimeToFirstResponseData = [30, 40, 35, 45, 50, 38, 42]; // Example data for line graph

    // Initialize with personal analytics data
    this.setPersonalData();
  }

  setPersonalData() {
    this.overdueTicketsCount = this.personalOverdueTicketsCount;
    this.ticketsDueTodayCount = this.personalTicketsDueTodayCount;
    this.openTicketsCount = this.personalOpenTicketsCount;
    this.pendingTicketsCount = this.personalPendingTicketsCount;
    this.averageTimeToFirstResponse = this.personalAverageTimeToFirstResponse;
    this.timeToFirstResponseData = this.personalTimeToFirstResponseData;
    this.createLineChart();
  }

  updateGroupData() {
    // Mock data for each group
    if (this.selectedGroup === 'group1') {
      this.overdueTicketsCount = 5;
      this.ticketsDueTodayCount = 2;
      this.openTicketsCount = 8;
      this.pendingTicketsCount = 3;
      this.averageTimeToFirstResponse = '45 mins';
      this.timeToFirstResponseData = [50, 55, 40, 48, 60, 52, 45]; // Example data for line graph
    } else if (this.selectedGroup === 'group2') {
      this.overdueTicketsCount = 7;
      this.ticketsDueTodayCount = 3;
      this.openTicketsCount = 10;
      this.pendingTicketsCount = 5;
      this.averageTimeToFirstResponse = '52 mins';
      this.timeToFirstResponseData = [60, 55, 65, 50, 48, 55, 58]; // Example data for line graph
    } else if (this.selectedGroup === 'group3') {
      this.overdueTicketsCount = 3;
      this.ticketsDueTodayCount = 1;
      this.openTicketsCount = 6;
      this.pendingTicketsCount = 2;
      this.averageTimeToFirstResponse = '38 mins';
      this.timeToFirstResponseData = [40, 35, 42, 38, 45, 32, 40]; // Example data for line graph
    } else {
      // If selected group is not available, set personal analytics data
      this.setPersonalData();
    }

    this.createLineChart();
  }

  onAnalyticsTypeChange() {
    if (this.selectedAnalyticsType === 'personal') {
      this.setPersonalData();
    } else if (this.selectedAnalyticsType === 'group') {
      this.updateGroupData();
    }
  }

  ngAfterViewInit() {
    // Call createLineChart after the view is initialized
    this.createLineChart();
  }
  

  onGroupChange() {
    if (this.selectedAnalyticsType === 'group') {
      this.updateGroupData();
    }
  }

  loggedHoursData: any[] = [
    { ticketDescription: 'Update user interface for the system', timeTaken: '2 hours' },
    { ticketDescription: 'Complete API calls', timeTaken: '3.5 hours' },
    { ticketDescription: 'Fix the backend', timeTaken: '1.5 hours' },
    { ticketDescription: 'Complete tests', timeTaken: '4 hours' },
    { ticketDescription: 'Perform automation', timeTaken: '2.5 hours' },
    // Add more mock data as needed
  ];

  createLineChart() {
    if (this.lineChart && this.lineChart.nativeElement) {
      const ctx: CanvasRenderingContext2D = this.lineChart.nativeElement.getContext('2d')!;
      const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Time to First Response',
            data: this.timeToFirstResponseData,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.4
          }
        ]
      };
      const options = {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };
      new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
      });
    }
  }
}
