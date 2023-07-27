import { Component, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TicketsService } from 'src/services/ticket.service';
import { NotificationsService } from 'src/services/notifications.service';
import { ticket } from "../../../../backend/tickets/src/models/ticket.model";
import { notifications } from "../../../../backend/notifications/src/models/notifications.model";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
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
  assignee!: user;
  navbarIsCollapsed!: boolean;
  allUsers: user[] = [];
  allGroups: group[] = [];
  allProjects: project[] = [];
  assignedUser!: user;
  todoAdded = false;
  isAddTodoOverlayOpened = false;
  todo: FormControl = new FormControl();
  todoArray: string[] = [];
  todoChecked: boolean[] = [];

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
      project: '',
      todo: ''
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

    // this.todoArray.length = 0;
    // this.todoChecked.length = 0;
  }

  onGroupChanged(event: Event) {
    const groupSelectedId = (event.target as HTMLSelectElement).value;
    console.log('group selected id: ', groupSelectedId);
  }

  getAssigneeName() {
    this.assigneeName = this.authService.getName();
    this.assignee = this.authService.getUser();

    console.log("Assignee Name: ", this.assigneeName);

    return this.assigneeName;
  }

  getAllAssignable(selectedTodos: group[]) {
    const userArray = this.userService.getAllUsers().subscribe((response: user[]) => {
      this.allUsers = response.filter((user) => {
        return user.groups.some((userGroup) => selectedTodos.some((selectedGroup) => userGroup === selectedGroup.id));
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
      const assignee = this.assignee.emailAddress;
      const assigned = this.assignedUser.emailAddress;
      const group = ticketFormValues.group;
      const priority = ticketFormValues.priority;

      // get Current Date in String Format
      const currentDate = new Date();

      const startDate = this.formatDate(this.stringFormatDate(currentDate));
      const endDate = this.formatDate(ticketFormValues.endDate);
      const status = "Active";
      const comments = ticketFormValues.comments;
      const description = trimmedDescription;
      // const description = ticketFormValues.description;
      const project = ticketFormValues.project;
      const assigneeFullName = this.assignee.name + " " + this.assignee.surname;
      const assignedFullName = this.assignedUser.name + " " + this.assignedUser.surname;


      console.log("todoArray.length: ", this.todoArray.length);
      for (let i = 0; i < this.todoArray.length; i++) {
        this.todoChecked.push(false);
      }

      console.log("todoChecked", this.todoChecked);


      let groupName = "";

      this.groupService.getGroupById(group).subscribe((response: group) => {
          groupName = response.groupName;

           // adding new ticket
      this.ticketService.addTicket(summary, description, assignee, assigned, groupName, priority, startDate, endDate, status, comments, project, this.todoArray, this.todoChecked, assigneeFullName, assignedFullName).subscribe((response: any) => {
        const newTicketId = response.newTicketID;
        console.log(response);

        this.groupService.updateTicketsinGroup(group, newTicketId).subscribe((response: any) => {
          console.log(response);
          }
        );
        // should navigate to ticket directly
        //this.router.navigate([`/ticket/${newTicketId}`]);

        // get the corresponding users
        let assigneeUser!: user;

        this.authService.getUserObject().subscribe(
          (response) => {
            assigneeUser = response;

             // create a notification corresponding to the ticket
        
        const profilePhotoLink = assigneeUser.profilePhoto;
        const notificationMessage = " assigned an issue to you";
        const creatorEmail = assignee;
        const assignedEmail = assigned;
        const ticketSummary = "Ticket: " + summary;
        const ticketStatus = status;
        const notificationTime = new Date();
        const link = newTicketId;
        const readStatus = "Unread"
        const creatorFullName = assigneeFullName;

        this.notificationsService.newNotification(profilePhotoLink, notificationMessage, creatorEmail, assignedEmail, ticketSummary, ticketStatus, notificationTime, link, readStatus, creatorFullName).subscribe((response: any) => {
          console.log(response);
        });
          }
        );
        
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
        project: project,
        todo: this.todoArray,
        todoChecked: this.todoChecked,
        assigneeFullName: assigneeFullName,
        assignedFullName: assignedFullName
      };

      this.newTicketEvent.emit(newTicket);
      this.ticketForm.reset();

      // should navigate to ticket directly
      //this.router.navigate(['/ticket/${id}']);
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

  private stringFormatDate(date: Date): string {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }

    if ( day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  @ViewChild('textBox') textBox!: ElementRef<HTMLTextAreaElement>;

  // handleKeyDown(event: any) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();

  //     const textBox = this.textBox.nativeElement;
  //     const selection = window.getSelection();

  //     if (!selection) {
  //       return;
  //     }

  //     const range = selection.getRangeAt(0);
  //     const listItem = document.createElement('li');
  //     listItem.textContent = '\u00A0'; // Non-breaking space

  //     range.deleteContents();
  //     range.insertNode(listItem);
  //     range.setStart(listItem, 0);
  //     range.setEnd(listItem, 0);

  //     selection.removeAllRanges();
  //     selection.addRange(range);
  //   }
  // }

  // handleInput(event: any) {
  //   const textBox = this.textBox.nativeElement;
  //   const selection = window.getSelection();
  //   const lines = textBox.innerText.split('\n');

  //   const bullet = "\u2022";
  //   const bulletSpace = `${bullet} `;
  //   const bulletLength = bulletSpace.length;

  //   const currentLine = lines[selection?.focusOffset || 0];
  //   const bulletIndex = currentLine.indexOf(bulletSpace);

  //   let htmlContent = '';
  //   for (const line of lines) {
  //     htmlContent += `<li>${line}</li>`;
  //   }

  //   textBox.innerHTML = htmlContent !== '' ? `<ul>${htmlContent}</ul>` : '';

  //   if (textBox.type !== 'textarea' && textBox.getAttribute('contenteditable') === 'true') {
  //     textBox.focus();
  //     selection?.selectAllChildren(textBox);

  //     // Adjust cursor position to accommodate bullet points
  //     const range = selection?.getRangeAt(0);
  //     if (range && range.startContainer.nodeName === 'LI') {
  //       const offset = range.startOffset;
  //       range.setStart(range.startContainer.firstChild!, bulletIndex + bulletLength + offset); // Move cursor after the bullet point
  //     }

  //     selection?.collapseToEnd();
  //   } else {
  //     // Place cursor at the end of text areas and input elements
  //     textBox.focus();
  //     textBox.select();
  //     selection?.collapseToEnd();
  //   }
  // }

  toggleAddTodoOverlay(){
    this.isAddTodoOverlayOpened = !this.isAddTodoOverlayOpened;
  }

  addTodo() {
    this.todoArray.push(this.todo.value);
    console.log("Todo Value: ", this.todo.value);
    console.log("Todo Array: ", this.todoArray);
    this.todo.reset();
    this.toggleAddTodoOverlay();

    if (this.todoArray.length > 0) {
      this.todoAdded = true;
    }
  }

  editTodoTab(event: MouseEvent, index: number): void {
    console.log("");
  }

  removeTodoTab(event: MouseEvent, index: number): void {
    const targetElement = event.target as HTMLElement;
    const todoTabElement = targetElement.closest('.todo-tab');
    if (todoTabElement) {
      const todoNameElement = todoTabElement.querySelector('p');
      if (todoNameElement) {
        const todoName = todoNameElement.textContent;
        if (todoName) {
          const selectedTodoIndex = this.todoArray.findIndex(todo => todo === todoName);
          if (selectedTodoIndex !== -1) {
            this.todoArray.splice(selectedTodoIndex, 1);
          }
        }
      }
      todoTabElement.remove();

    }

    if(this.todoArray.length == 0) {
      this.todoAdded = false;
    }
  }

  handleKeyupEvent(event: KeyboardEvent): void {
    console.log("");
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
