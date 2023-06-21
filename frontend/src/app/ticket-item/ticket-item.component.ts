import { Component, Input } from '@angular/core';
import { ticket } from '../../../../backend/src/models/ticket.model';
@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent {
  @Input() ticket!: ticket;
}
