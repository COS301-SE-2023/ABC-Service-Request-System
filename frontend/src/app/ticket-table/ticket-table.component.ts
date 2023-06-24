import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
// import { tickets } from '../data';
import { TicketsService } from 'src/services/ticket.service';
import { ticket } from '../../../../backend/src/models/ticket.model';
import { Router } from '@angular/router';

import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-ticket-table',
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss']
})

export class TicketTableComponent implements OnInit{
  constructor(private ticketService: TicketsService, private router: Router) { }

  allTicketsArray: ticket[] = [];
  sortedTicketsArray: ticket[] = [];

  @Input() tickets: any[] = [];
  @Output() openForm = new EventEmitter<string>();

  openUpdateForm(oldAssignee: string){
    this.openForm.emit(oldAssignee);
  }

  getTicketsForTable(){
    this.ticketService.getAllTickets().subscribe((response: ticket[]) => {
      this.allTicketsArray = response.sort((a, b) => {
        return this.comparePriority(a.priority, b.priority, false);
      });
      this.sortedTicketsArray = this.allTicketsArray.slice();
    })
  }

  ngOnInit(): void {
      this.getTicketsForTable();
  }

  navigateToTicket(id: string) {
    this.router.navigate([`/ticket/${id}`]);
  }

  sortData(sort: Sort){
    const data = this.sortedTicketsArray.slice();
    if(!sort.active || sort.direction === ''){
      this.sortedTicketsArray = data;
      return;
    }

    this.sortedTicketsArray = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compare(a.id, b.id, isAsc);
        case 'summary':
          return this.compare(a.summary, b.summary, isAsc);
        case 'assignee':
          return this.compare(a.assignee, b.assignee, isAsc);
        case 'assigned':
          return this.compare(a.assigned, b.assigned, isAsc);
        case 'group':
          return this.compare(a.group, b.group, isAsc);
        case 'priority':
          return this.comparePriority(a.priority, b.priority, isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        case 'created':
          return this.compareDates(a.startDate, b.startDate, isAsc);
        case 'deadline':
          return this.compareDates(a.endDate, b.endDate, isAsc);
        default:
          return 0
      }
    })
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  comparePriority(a: string, b: string, isAsc: boolean) {
    const priorityOrder = ["LOW", "MEDIUM", "HIGH"];
    const aIndex = priorityOrder.indexOf(a.toUpperCase());
    const bIndex = priorityOrder.indexOf(b.toUpperCase());

    if (isAsc) {
      return aIndex - bIndex;
    } else {
      return bIndex - aIndex;
    }
  }

  compareDates(a: string, b: string, isAsc: boolean) {
    const dateA = this.getDateFromFormat(a);
    const dateB = this.getDateFromFormat(b);

    if (dateA < dateB) {
      return isAsc ? -1 : 1;
    } else if (dateA > dateB) {
      return isAsc ? 1 : -1;
    } else {
      return 0;
    }
  }

  getDateFromFormat(date: string) {
    const parts = date.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is zero-based in JavaScript Date
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
}

