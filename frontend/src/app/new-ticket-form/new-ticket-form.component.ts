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
import { group } from '../../../../backend/src/models/group.model';
import{ GroupService } from 'src/services/group.service';
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
  allGroups: group[] = [];
  assignedUser!: user;

  constructor(private ticketService: TicketsService, private notificationsService: NotificationsService, private authService: AuthService,
    private userService: UserService, private formBuilder: FormBuilder, private router: Router, private groupService: GroupService, private navbarService: NavbarService) {
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

    this.groupService.getGroups().subscribe((response: group[]) => {
      this.allGroups = response;
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
      console.log("All Users: ", this.allUsers);
      return this.allUsers;
    });
  }

  onSubmit() {

    if (this.ticketForm.valid) {

      const ticketFormValues = this.ticketForm.value;

      // trimming description
      const trimmedDescription = this.stripPTags(ticketFormValues.description);

      const summary = ticketFormValues.summary;
      const assignee = this.authService.getName();
      const assigned = ticketFormValues.assigned.name;
      const group = ticketFormValues.group;
      const priority = ticketFormValues.priority;
      const startDate = this.formatDate(ticketFormValues.startDate);
      const endDate = this.formatDate(ticketFormValues.endDate);
      const status = ticketFormValues.status;
      const comments = ticketFormValues.comments;
      const description = trimmedDescription;
      let groupName = "";

      this.groupService.getGroupById(group).subscribe((response: group) => {
          groupName = response.groupName;

           // adding new ticket
      this.ticketService.addTicket(summary, description, assignee, assigned, groupName, priority, startDate, endDate, status, comments).subscribe((response: any) => {
        const newTicketId = response.newTicketID;
        console.log(response);

        this.groupService.updateTicketsinGroup(group, newTicketId).subscribe((response: any) => {
          console.log(response);
          }
        );
        // should navigate to ticket directly
        this.router.navigate([`/ticket/${newTicketId}`]);

        // get the corresponding users
        const assigneeUser = this.authService.getUser();

        // create a notification corresponding to the ticket
        const profilePhotoLink = assigneeUser.profilePhoto;
        const notificationMessage = " assigned an issue to you";
        const creatorEmail = assigneeUser.emailAddress;
        const assignedEmail = this.assignedUser.emailAddress;
        const ticketSummary = summary;
        const ticketStatus = "Pending";
        const notificationTime = new Date();
        const link = newTicketId;
        const readStatus = "Unread"

        this.notificationsService.newNotification(profilePhotoLink, notificationMessage, creatorEmail, assignedEmail, ticketSummary, ticketStatus, notificationTime, link, readStatus).subscribe((response: any) => {
          console.log(response);
        });
      });
    }
  );





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
        description: description,
        createdAt: new Date(),
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

  onAssignedChange() {
    const assignedControl = this.ticketForm.get('assigned');

    if (assignedControl) {
      this.assignedUser = assignedControl.value;
      console.log(this.assignedUser);
    }
  }

  stripPTags(content: string): string {
    return content.replace(/<\/?p>/g, '');
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
