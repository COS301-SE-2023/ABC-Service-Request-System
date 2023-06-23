import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tickets } from '../data';
import { Subscription } from 'rxjs';
import { TicketsService } from 'src/services/ticket.service';
import { ticket } from '../../../../backend/src/models/ticket.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})

export class TicketDetailComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private ticketService: TicketsService) { }

  ticket!: ticket;
  ticketPanelOpenState = false;
  SLAPanelOpenState = true;
  detailsPanelOpenState = true;
  private routeSubscription: Subscription = new Subscription();
  commentInputControl = new FormControl('');

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

  onSave(): void {
    const newComment = this.commentInputControl.value;
    // Perform actions with the input value, e.g., save to database, send to API, etc.
    console.log('Input Value:', newComment);
    if(newComment){
      alert(this.ticket.id);
      this.ticketService.makeAComment(this.ticket.id, newComment).subscribe(
        res => {
          console.log('Comment added successfully', res);
        },
        err => {
          console.log('Error while adding comment', err);
        }
      );
    }

  }
}
