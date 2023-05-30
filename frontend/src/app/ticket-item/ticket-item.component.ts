import { Component, Input, Output, EventEmitter } from '@angular/core';
import { tickets } from '../data';


@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})

export class TicketItemComponent {
  @Input() tickets: any[] = [];
  @Output() openForm = new EventEmitter<string>();

  openUpdateForm(oldAssignee: string){
    this.openForm.emit(oldAssignee);
  }
}

