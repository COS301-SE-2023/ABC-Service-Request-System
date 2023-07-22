import { Component, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TicketsService } from 'src/services/ticket.service';
import { NotificationsService } from 'src/services/notifications.service';
import { ticket } from "../../../../backend/tickets/src/models/ticket.model";
import { notifications } from "../../../../backend/notifications/src/models/notifications.model";
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { user } from "../../../../backend/users/src/models/user.model";
import { UserService } from 'src/services/user.service';
import { NavbarService } from 'src/services/navbar.service';
import { group } from '../../../../backend/groups/src/models/group.model';
import{ GroupService } from 'src/services/group.service';
import { client, project } from '../../../../backend/clients/src/models/client.model';
import { ClientService } from 'src/services/client.service';
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
  allProjects: project[] = [];
  assignedUser!: user;

  constructor(
    private ticketService: TicketsService,
    private notificationsService: NotificationsService,
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private groupService: GroupService,
    private navbarService: NavbarService,
    private clientService: ClientService) {
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
      project: ''
    });

    this.assigneeName = '';
  }

  @Output() newTicketEvent = new EventEmitter();
  @Output() closeForm = new EventEmitter();


  ngOnInit(): void {
    this.getAssigneeName();

    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
    });

    // this.groupService.getGroups().subscribe((response: group[]) => {
    //   this.allGroups = response;
    // });

    this.clientService.getAllClients().subscribe(
      (response) => {
        response.forEach((client) => {
          client.projects.forEach((project) => {
            if(!this.allProjects.includes(project))
              this.allProjects.push(project);

              if(this.allProjects.length > 0) {
                this.ticketForm.get('project')?.setValue(this.allProjects[0].name);
                if(this.allProjects[0].assignedGroups){
                  this.allGroups = this.allProjects[0].assignedGroups;
                  this.getAllAssignable(this.allGroups);
                }
              }
          })
        })
      }, (error) => {
        console.log("Error fetching all clients", error);
      }
    );
  }

  onGroupChanged(event: Event) {
    const groupSelectedId = (event.target as HTMLSelectElement).value;
    console.log('group selected id: ', groupSelectedId);
  }

  getAssigneeName() {
    this.assigneeName = this.authService.getName();

    console.log("Assignee Name: ", this.assigneeName);

    return this.assigneeName;
  }

  getAllAssignable(selectedGroups: group[]) {
    const userArray = this.userService.getAllUsers().subscribe((response: user[]) => {
      this.allUsers = response.filter((user) => {
        return user.groups.some((userGroup) => selectedGroups.some((selectedGroup) => userGroup === selectedGroup.id));
      });
      console.log("All Users: ", this.allUsers);
      return this.allUsers;
    });
  }

  projectChanged(event: Event){
    const selectedProjectName = (event.target as HTMLSelectElement).value;
    const selectedProject = this.allProjects.find((project) => project.name === selectedProjectName);
    if (selectedProject) {
      console.log('Selected Project:', selectedProject);

      if(selectedProject.assignedGroups)
        this.allGroups = selectedProject.assignedGroups;

      this.getAllAssignable(this.allGroups);
    } else {
      console.log('Project not found:', selectedProjectName);
    }
  }

  onSubmit() {

    this.ticketForm.get('assignee')?.setValue(this.assigneeName);

    console.log(this.ticketForm, ' form');

    if (this.ticketForm.valid) {

      const ticketFormValues = this.ticketForm.value;

      // trimming description
      const trimmedDescription = this.stripPTags(ticketFormValues.description);

      const summary = ticketFormValues.summary;
      const assignee = this.assigneeName;
      const assigned = ticketFormValues.assigned.name;
      const group = ticketFormValues.group;
      const priority = ticketFormValues.priority;
      const startDate = this.formatDate(ticketFormValues.startDate);
      const endDate = this.formatDate(ticketFormValues.endDate);
      const status = ticketFormValues.status;
      const comments = ticketFormValues.comments;
     const description = trimmedDescription;
      // const description = ticketFormValues.description;
      const project = ticketFormValues.project;
      let groupName = "";

      this.groupService.getGroupById(group).subscribe((response: group) => {
          groupName = response.groupName;

           // adding new ticket
      this.ticketService.addTicket(summary, description, assignee, assigned, groupName, priority, startDate, endDate, status, comments, project).subscribe((response: any) => {
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
        const ticketSummary = "Ticket: " + summary;
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
        project: project
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

  @ViewChild('textBox') textBox!: ElementRef<HTMLTextAreaElement>;

  handleKeyDown(event: any) {
    if (event.key === 'Enter') {
      event.preventDefault();

      const textBox = this.textBox.nativeElement;
      const selection = window.getSelection();

      if (!selection) {
        return;
      }

      const range = selection.getRangeAt(0);
      const listItem = document.createElement('li');
      listItem.textContent = '\u00A0'; // Non-breaking space

      range.deleteContents();
      range.insertNode(listItem);
      range.setStart(listItem, 0);
      range.setEnd(listItem, 0);

      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  handleInput(event: any) {
    const textBox = this.textBox.nativeElement;
    const lines = textBox.innerText.split('\n').filter(line => line.trim() !== '');

    let htmlContent = '';
    for (const line of lines) {
      if (line !== '') {
        htmlContent += `<li>${line}</li>`;
      }
    }

    textBox.innerHTML = htmlContent !== '' ? `<ul>${htmlContent}</ul>` : '';
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

  getUsersProfilePicture() {
    const user = this.authService.getUser();
    return user.profilePhoto;
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
