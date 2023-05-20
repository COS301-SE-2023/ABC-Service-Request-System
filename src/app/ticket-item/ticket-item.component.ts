import { Component, Input } from '@angular/core';
import { tickets } from '../data';


@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})

export class TicketItemComponent {
  @Input() tickets: any[] = [];
}

