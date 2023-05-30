import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-update-ticket-modal',
  templateUrl: './update-ticket-modal.component.html',
  styleUrls: ['./update-ticket-modal.component.scss']
})
export class UpdateTicketModalComponent {
  @Output() updateTicketEvent = new EventEmitter<any>();
  @Output() closeUpdateForm = new EventEmitter();

  constructor(private fb: FormBuilder){}

  updateTicketForm = this.fb.group({
    id: [''], //automatic incrr
    newAssignee: [''],
  });

  onSubmit(){
    console.log(this.updateTicketForm.value.newAssignee);
    this.updateTicketEvent.emit(this.updateTicketForm.value.newAssignee);
    this.updateTicketForm.reset();
  }
}
