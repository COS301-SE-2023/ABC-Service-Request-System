import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { tickets } from '../data'
import { Ticket } from '../app.component';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  tickets = tickets;
  searchTerm = '';
  filteredTickets = this.tickets;
  showForm = false;

  @Output() openForm = new EventEmitter<void>();
  // @Input() tickets: any[] = [];

  constructor(private router: Router) {}

  openNewTicketForm() {
    this.openForm.emit();
  }

  getNewId(): number {
    return this.tickets.length > 0 ? Math.max(...this.tickets.map(ticket => ticket.id)) + 1 : 1;
  }

  addNewTicket(newTicket: Ticket) {
    newTicket.id = this.getNewId();
    this.tickets.push(newTicket);
    this.showForm = false;
  }

  closeForm(): void {
    this.showForm = false;
  }

  openNotifications() {
    this.showForm = true;
  }

  closeNotificationsForm(): void {
    this.showForm = false;
  }
}
