import { Component } from '@angular/core';
import { Ticket } from './ticket.model';
import { OnInit } from '@angular/core';

@Component({
  selector: 'ticket-dashboard',
  templateUrl: './ticket-dashboard.component.html',
  styleUrls: ['./ticket-dashboard.component.scss'],
})
export class TicketDashboardComponent implements OnInit {
  tickets: Ticket[] = []; // Assuming you have an array of tickets

  ngOnInit() {
    // Logic to fetch or initialize the tickets data
    this.fetchTickets();
    alert(this.tickets)
  }

  fetchTickets() {
    this.tickets = [
      {
        id: 1,
        summary: 'Ticket 1 Summary',
        creator: 'John Doe',
        assignee: 'Jane Smith',
        group: 'Support',
        priority: 'High',
        created: '2023-05-20',
        deadline: '2023-05-25',
        status: 'Open'
      },
      {
        id: 2,
        summary: 'Ticket 2 Summary',
        creator: 'Alice Johnson',
        assignee: 'Bob Brown',
        group: 'Development',
        priority: 'Medium',
        created: '2023-05-18',
        deadline: '2023-05-23',
        status: 'In Progress'
      },
      // Add more tickets as needed
    ];
  }
}

