import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tickets } from '../data';
import { Subscription } from 'rxjs';
import { TicketsService } from 'src/services/ticket.service';
import { ticket } from '../../../../backend/src/models/ticket.model';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private ticketService: TicketsService) { }

  ticket!: ticket;
  private routeSubscription: Subscription = new Subscription();

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      // this.ticket = tickets.find(ticket => ticket.id === Number(id));
      if(id)
        this.getTicketWithId(id);
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  getTicketWithId(ticketId: string){
    this.ticketService.getTicketWithID(ticketId).subscribe((resonse: ticket) => {
      console.log("haha ", resonse);
      this.ticket = resonse;
    })
  }
}
