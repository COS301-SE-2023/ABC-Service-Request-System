import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tickets } from './data';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

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
  comments: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Project';

  isLoginRoute = false;
  isActivateAccountRoute = false;
  isClientRoute = false;

  routerSubscription!: Subscription;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    console.log('newest build')
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('app init url: ', event.urlAfterRedirects);
        this.isLoginRoute = event.urlAfterRedirects.includes('login');
        this.isActivateAccountRoute = event.urlAfterRedirects.includes('activate_account');
        this.isClientRoute = event.urlAfterRedirects.includes('client-dashboard') || event.urlAfterRedirects.includes('room');
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  getData(): Observable<any> {
    return this.http.get('http://localhost:3000/api/data');
  }

  fetchData() {
    this.getData().subscribe({
      next: (response) => {
        const message = response.message;
        alert(message);
        return message;
      },
      error: () => {
        alert('Error fetching data');
        return 'Error fetching data';
      }
    });
  }

  searchTerm = '';
  tickets = tickets;
  filteredTickets = this.tickets;
  showForm = false;

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
