import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
// import { tickets } from '../data';
import { TicketsService } from 'src/services/ticket.service';
import { ticket } from '../../../../backend/src/models/ticket.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-table',
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss']
})

export class TicketTableComponent implements OnInit{
  constructor(private ticketService: TicketsService, private router: Router) { }

  allTicketsArray: ticket[] = [];

  @Input() tickets: any[] = [];
  @Output() openForm = new EventEmitter<string>();

  openUpdateForm(oldAssignee: string){
    this.openForm.emit(oldAssignee);
  }

  getTicketsForTable(){
    this.ticketService.getAllTickets().subscribe((response: ticket[]) => {
      this.allTicketsArray = response;
    })
  }

  ngOnInit(): void {
      // alert('lol');
      this.getTicketsForTable();
  }

  navigateToTicket(event: Event) {
    event.preventDefault();
    this.router.navigate(['/ticket/1']);
  }
}

