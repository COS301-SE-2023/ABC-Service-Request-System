import { Component } from '@angular/core';
import { tickets } from './data'
import { Router } from '@angular/router';

export interface Ticket {
  id: number;
  title: string;
  assignee: string;
  reviewer: string;
  company: string;
  priority: string;
  startDate: string;
  endDate: string;
  status: string;
}


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
  showForm = false;

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

  openNewTicketForm() {
    this.showForm = true;
  }

  getNewId(): number {
    return this.tickets.length > 0 ? Math.max(...this.tickets.map(ticket => ticket.id)) + 1 : 1;
  }

  addNewTicket(newTicket: Ticket) {
    newTicket.id = this.getNewId();
    this.tickets.push(newTicket);
    this.showForm = false;
    this.filterTickets();
  }

  closeForm(): void {
    this.showForm = false;
  }

}
