import { Component, Output, EventEmitter } from '@angular/core';
import { TicketsService } from 'src/services/ticket.service';
import { ticket } from '../../../../backend/src/models/ticket.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-ticket-form',
  templateUrl: './new-ticket-form.component.html',
  styleUrls: ['./new-ticket-form.component.scss']
})
export class NewTicketFormComponent {
  ticketForm!: FormGroup;

  constructor(private ticketService: TicketsService, private formBuilder: FormBuilder, private router: Router) {
    this.ticketForm = this.formBuilder.group({
      summary: '',
      assignee: '',
      assigned: '',
      group: '',
      priority: '',
      startDate: '',
      endDate: '',
      status: ''
    });
  }

  @Output() newTicketEvent = new EventEmitter();
  @Output() closeForm = new EventEmitter();

  onSubmit() {
    if (this.ticketForm.valid) {
      const formValues = this.ticketForm.value;
      
      const summary = formValues.summary;
      const assignee = formValues.assignee;
      const assigned = formValues.assigned;
      const group = formValues.group;
      const priority = formValues.priority;
      const startDate = formValues.startDate;
      const endDate = formValues.endDate;
      const status = formValues.status;

      this.ticketService.addTicket(summary, assignee, assigned, group, priority, startDate, endDate, status);

      // emitting for now so that there's no errors
      const newTicket: ticket = {
        id: "test",
        summary: summary,
        assignee: assignee,
        assigned: assigned,
        group: group,
        priority: priority,
        startDate: startDate,
        endDate: endDate,
        status: status
      };

      this.newTicketEvent.emit(newTicket);
      this.ticketForm.reset();

      // should navigate to ticket directly
      this.router.navigate(['/ticket/${id}']);
    } 
    else {
      // Handle invalid form submission
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }

 /* ticketForm = this.fb.group({
    id: [''], //automatic incrr
    summary: [''],
    assignee: [''],
    reviewer: [''],
    company: [''],
    priority: [''],
    startDate: [''],
    endDate: [''],
    status: [''],
  });

  constructor(private fb: FormBuilder) { }

  onSubmit() {
    this.newTicketEvent.emit(this.ticketForm.value);
    this.ticketForm.reset();
  }

  @Output() closeForm = new EventEmitter();*/

}
