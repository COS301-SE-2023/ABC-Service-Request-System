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
      status: '',
      comments: ''
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
      const startDate = this.formatDate(formValues.startDate);
      const endDate = this.formatDate(formValues.endDate);
      const status = formValues.status;
      const comments = formValues.comments;

      this.ticketService.addTicket(summary, assignee, assigned, group, priority, startDate, endDate, status, comments).subscribe((response: any) => {
        console.log(response);
      });

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
        status: status,
        comments: comments
      };

      this.newTicketEvent.emit(newTicket);
      this.ticketForm.reset();

      // should navigate to ticket directly
     // this.router.navigate(['/ticket/${id}']);
    } 
    else {
      // Handle invalid form submission
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }

  private formatDate(date: string): string {
    const parts = date.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    return formattedDate;
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
