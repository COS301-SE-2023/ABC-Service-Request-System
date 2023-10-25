import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tickets } from '../data'
import { Ticket } from '../app.component';
import { AuthService } from '../../services/auth.service';  // Modify the path based on your actual file structure
import { NavbarService } from 'src/services/navbar.service';
import { TicketsService } from 'src/services/ticket.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  tickets = tickets;
  searchTerm = '';
  filteredTickets = this.tickets;
  showForm = false;
  showUpdateForm = false;
  oldAsignee = '';
  allTickets!: any[];

  navbarIsCollapsed!: boolean;
  selectedProjectName = '';

  ticketFailure = false;


  constructor(private router: Router, public authService: AuthService,
    public navbarService: NavbarService, public ticketService: TicketsService) {}

  ngOnInit(): void {
    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
    });

    this.ticketService.checkServerHealth().then((isServerUp) => {
      if (isServerUp) {
        this.ticketFailure = false;
      } else {
        this.ticketFailure = true;
      }
    });

    this.ticketService.getAllTickets().subscribe((tickets) => {
      this.allTickets = tickets;
      this.filterTicketsByStatusAndProject(this.currentStatus);
    });
    this.authService.selectedProject$.subscribe((project) => {
      this.selectedProjectName = project;
      console.log('in dashboard ngOninit...');
      console.log('currently selected project:');
      console.log(this.selectedProjectName);
    });
  }

  openNewTicketForm() {
    if (this.authService.isAdmin() || this.authService.isManager()) {  // Only Admin and Manager can open a new ticket form
      this.showForm = true;
    }
  }

  ngOnChanges(): void {
    this.filterTickets();
  }

  filterTickets(): void {
    if (!this.searchTerm) {
      this.filteredTickets = this.tickets;
    }
  }

  searchTicket(searchTerm: string): void {
    const ticketId = parseInt(searchTerm, 10);
    const ticket = this.tickets.find(ticket => ticket.id === ticketId);
    if (ticket) {
      this.filteredTickets = [ticket];
      this.router.navigate(['/ticket', ticketId]);
    } else {
      this.filteredTickets = [];
    }
}

  getNewId(): number {
    return this.tickets.length > 0 ? Math.max(...this.tickets.map(ticket => ticket.id)) + 1 : 1;
  }

  addNewTicket(newTicket: Ticket) {
    if (this.authService.isAdmin() || this.authService.isManager()) {  // Only Admin and Manager can add a new ticket
      newTicket.id = this.getNewId();
      this.tickets.push(newTicket);
      this.showForm = false;
    }
  }

  updateTicket(newAssignee: string){
    if (this.authService.isAdmin() || this.authService.isManager()) {  // Only Admin and Manager can update a ticket
      const ticket = this.tickets.find(ticket => ticket.assignee == this.oldAsignee);
      if(ticket) {
        ticket.assignee = newAssignee;
      }
      this.showUpdateForm = false;
    }
  }

  closeForm(): void {
    this.showForm = false;
  }


  //Update-ticket-modal
  openUpdateForm(oldAssignee: string){
    if (this.authService.isAdmin() || this.authService.isManager()) {  // Only Admin and Manager can open the update form
      this.oldAsignee = oldAssignee;
      this.showUpdateForm = true;
    }
  }

  closeUpdateForm(){
    this.showUpdateForm = false;
  }

  currentStatus = 'all';
  filterTicketsByStatusAndProject(status: string): void {
    this.currentStatus = status;
    if (status === 'all') {
      this.filteredTickets = this.allTickets.filter(
        (ticket) => ticket.project === this.selectedProjectName
      );
    } else {
      this.filteredTickets = this.allTickets.filter(
        (ticket) =>
          ticket.status.toLowerCase() === status &&
          ticket.project === this.selectedProjectName
      );
    }
  }

  onProjectChanged(newProjectName: string) {
    this.selectedProjectName = newProjectName;
    console.log('in dashboard.compionent...');
    console.log(this.selectedProjectName);
  }

}
