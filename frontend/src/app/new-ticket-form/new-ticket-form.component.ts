import { Component, Output, EventEmitter } from '@angular/core';
import { TicketsService } from 'src/services/ticket.service';
import { NotificationsService } from 'src/services/notifications.service';
import { ticket } from '../../../../backend/src/models/ticket.model';
import { notifications } from '../../../../backend/src/models/notifications.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-ticket-form',
  templateUrl: './new-ticket-form.component.html',
  styleUrls: ['./new-ticket-form.component.scss']
})
export class NewTicketFormComponent {
  ticketForm!: FormGroup;

  constructor(private ticketService: TicketsService, private notificationsService: NotificationsService, private formBuilder: FormBuilder, private router: Router) {
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
      const ticketFormValues = this.ticketForm.value;

      const summary = ticketFormValues.summary;
      const assignee = ticketFormValues.assignee;
      const assigned = ticketFormValues.assigned;
      const group = ticketFormValues.group;
      const priority = ticketFormValues.priority;
      const startDate = this.formatDate(ticketFormValues.startDate);
      const endDate = this.formatDate(ticketFormValues.endDate);
      const status = ticketFormValues.status;
      const comments = ticketFormValues.comments;

      // adding new ticket
      this.ticketService.addTicket(summary, assignee, assigned, group, priority, startDate, endDate, status, comments).subscribe((response: any) => {
        const newTicketId = response.newTicketID;
        console.log(response);

        // should navigate to ticket directly
        this.router.navigate([`/ticket/${newTicketId}`]);

        // create a notification corresponding to the ticket
        const profilePhotoLink = "https://i.imgur.com/zYxDCQT.jpg";
        const notificationMessage = " assigned an issue to you";
        const creatorEmail = "test@example.com";
        const assignedEmail = "test@example.com";
        const ticketSummary = summary;
        const ticketStatus = "Done";
        const notificationTime = new Date();
        const link = newTicketId;

        this.notificationsService.newNotification(profilePhotoLink, notificationMessage, creatorEmail, assignedEmail, ticketSummary, ticketStatus, notificationTime, link).subscribe((response: any) => {
          console.log(response);
        });
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
