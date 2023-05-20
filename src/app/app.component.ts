import { Component } from '@angular/core';
import { tickets } from './data'
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Project';
  searchTerm: string = '';
  tickets = tickets;
  filteredTickets = this.tickets;

  constructor(private router: Router) { }

  ngOnChanges(): void {
    this.filterTickets();
  }

  filterTickets(): void {
    if (!this.searchTerm) {
      this.filteredTickets = this.tickets;
    }
  }

  searchTicket(): void {
    const ticketId = parseInt(this.searchTerm, 10);
    const ticket = this.tickets.find(ticket => ticket.id === ticketId);
    if (ticket) {
      this.filteredTickets = [ticket];
      this.router.navigate(['/ticket', ticketId]);
    } else {
      this.filteredTickets = [];
    }
  }
}
