import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { TicketsService } from 'src/services/ticket.service';
import { NotificationsService } from 'src/services/notifications.service';
import { ticket } from '../../../../backend/src/models/ticket.model';
import { notifications } from '../../../../backend/src/models/notifications.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { user } from '../../../../backend/src/models/user.model';
import { UserService } from 'src/services/user.service';
import { NavbarService } from 'src/services/navbar.service';
@Component({
  selector: 'app-new-ticket-form',
  templateUrl: './new-ticket-form.component.html',
  styleUrls: ['./new-ticket-form.component.scss']
})
export class NewTicketFormComponent implements OnInit {
  ticketForm!: FormGroup;
  assigneeName: string;
  navbarIsCollapsed!: boolean;
  allUsers: user[] = [];

  constructor(private ticketService: TicketsService, private notificationsService: NotificationsService, private authService: AuthService, private userService: UserService, public navbarService: NavbarService, private formBuilder: FormBuilder, private router: Router) {
    this.ticketForm = this.formBuilder.group({
      summary: '',
      description: '',
      assignee: '',
      assigned: '',
      group: '',
      priority: '',
      startDate: '',
      endDate: '',
      status: '',
      comments: '',
    });

    this.assigneeName = ''; 
  }

  @Output() newTicketEvent = new EventEmitter();
  @Output() closeForm = new EventEmitter();


  ngOnInit(): void {
    this.getAssigneeName();
    this.getAllAssignable();

    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
    });
  }

  getAssigneeName() {
    this.assigneeName = this.authService.getName();

    console.log("Assignee Name: ", this.assigneeName);

    return this.assigneeName;
  }

  getAllAssignable() {
    const userArray = this.userService.getAllUsers().subscribe((response: user[]) => {
      this.allUsers = response;
      return this.allUsers;
    });
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      const ticketFormValues = this.ticketForm.value;

      const summary = ticketFormValues.summary;
      const assignee = this.authService.getName();
      const assigned = ticketFormValues.assigned;
      const group = ticketFormValues.group;
      const priority = ticketFormValues.priority;
      const startDate = this.formatDate(ticketFormValues.startDate);
      const endDate = this.formatDate(ticketFormValues.endDate);
      const status = ticketFormValues.status;
      const comments = ticketFormValues.comments;
      const description = ticketFormValues.description;

      // adding new ticket
      this.ticketService.addTicket(summary, description, assignee, assigned, group, priority, startDate, endDate, status, comments).subscribe((response: any) => {
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
        const readStatus = "Unread"

        this.notificationsService.newNotification(profilePhotoLink, notificationMessage, creatorEmail, assignedEmail, ticketSummary, ticketStatus, notificationTime, link, readStatus).subscribe((response: any) => {
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
        comments: comments,
        description: description
      };

      this.newTicketEvent.emit(newTicket);
      this.ticketForm.reset();

      // should navigate to ticket directly
      this.router.navigate(['/ticket/${id}']);
    }
    else {
      this.markFormControlsAsTouched(this.ticketForm);

      // Handle invalid form submission
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }
  
  markFormControlsAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
  
      if (control instanceof FormGroup) {
        this.markFormControlsAsTouched(control);
      }
    });
  }

  private formatDate(date: string): string {
    const parts = date.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    return formattedDate;
  }

  handleKeyDown(event: any) {
    if (event.key === 'Enter') {
      const textBox = event.target as HTMLDivElement;
      const selection = window.getSelection();
  
      if (!selection) {
        return;
      }
  
      const range = selection.getRangeAt(0);
      const listItem = document.createElement('li');
      const textNode = document.createTextNode('\u00A0'); // Non-breaking space
  
      event.preventDefault();
  
      range.deleteContents();
      listItem.appendChild(textNode);
      range.insertNode(listItem);
      range.setStart(listItem, 0);
      range.setEnd(listItem, 0);
  
      selection.removeAllRanges();
      selection.addRange(range);
  
      textBox.focus();
    }
  }
  
  handleInput(event: any) {
    const textBox = event.target as HTMLDivElement;
    const lines = textBox.innerText.split('\n').filter(line => line.trim() !== '');
  
    const listItems = lines.map(line => `<li>${line}</li>`).join('');
    textBox.innerHTML = listItems !== '' ? `<ul>${listItems}</ul>` : '';
    textBox.normalize(); // Normalize the HTML structure to remove any nested elements
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
