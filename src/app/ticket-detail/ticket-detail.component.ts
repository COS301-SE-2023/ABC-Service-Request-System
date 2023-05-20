import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tickets } from '../data';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
  ticket: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.ticket = tickets.find(ticket => ticket.id === Number(id));
  }
}
