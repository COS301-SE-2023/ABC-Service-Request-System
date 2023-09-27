import { Component, EventEmitter, HostListener, Input, Output, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tickets } from '../data'
import { Ticket } from '../app.component';
import { notifications } from "../../../../backend/notifications/src/models/notifications.model";
import { NotificationsService } from 'src/services/notifications.service';
import { AuthService } from 'src/services/auth.service';
import { user } from "../../../../backend/users/src/models/user.model";
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  tickets = tickets;
  searchTerm = '';
  filteredTickets = this.tickets;
  showNotificationsForm = false;
  showProfileForm = false;
  unreadNotificationsCount = 0;
  roles = '';
  user!: user;
  userPic!: string;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.closeForms();
    }
  }

  @Output() openForm = new EventEmitter<void>();
  // @Input() tickets: any[] = [];

  constructor(
    private notificationsService: NotificationsService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  allNotificationsArray: notifications[] = [];
  unreadNotificationsArray: notifications[] = [];

  openNewTicketForm() {
    this.openForm.emit();
  }

  getNewId(): number {
    return this.tickets.length > 0
      ? Math.max(...this.tickets.map((ticket) => ticket.id)) + 1
      : 1;
  }

  addNewTicket(newTicket: Ticket) {
    newTicket.id = this.getNewId();
    this.tickets.push(newTicket);
    this.closeForms();
  }

  closeForm(): void {
    this.closeForms();
  }

  openNotifications() {
    this.showNotificationsForm = true;
    this.showProfileForm = false;
  }

  closeNotificationsForm(): void {
    this.showNotificationsForm = false;
  }

  openPdf() {
    const pdfUrl = '/assets/UM.pdf'; // Adjust the path to your PDF file
    window.open(pdfUrl, '_blank');
  }
  
  openProfile() {
    if(this.showProfileForm) {
      this.closeProfile();
    } else {
      this.showProfileForm = true;
      this.showNotificationsForm = false;
    }
  }

  closeProfile() {
    this.showProfileForm = false;
  }

  closeForms() {
    this.showNotificationsForm = false;
    this.showProfileForm = false;
  }

  getNumOfUnreadNotifications() {
    this.notificationsService
      .getAllNotifications()
      .subscribe((response: notifications[]) => {
        this.allNotificationsArray = response;
        const user = this.authService.getUser();
        this.unreadNotificationsArray = this.allNotificationsArray.filter(
          (notifications) =>
            notifications.readStatus === 'Unread' &&
            notifications.assignedEmail === user.emailAddress
        );
        this.unreadNotificationsCount = this.unreadNotificationsArray.length;
      });
  }

  getRoles() {
    this.authService.getUserObject().subscribe((response) => {
      const user = response;

      if (user.roles[0] == 'Admin') {
        this.roles = 'Admin'; // Admin is already admin so won't have any other roles
      }

      if (user.roles[0] == 'Manager') {
        this.roles = 'Management';
      }

      if (user.roles[0] == 'Functional') {
        this.roles = 'Functional';
      }

      if (user.roles[0] == 'Technical') {
        this.roles = 'Technical';
      }

      if (user.roles.length > 1) {
        for (let i = 1; i < user.roles.length; i++) {
          if (user.roles[i] == 'Manager') {
            this.roles = this.roles + ', Management';
          }

          if (user.roles[i] == 'Functional') {
            this.roles = this.roles + ', Functional';
          }

          if (user.roles[i] == 'Technical') {
            this.roles = this.roles + ', Technical';
          }
        }
      }
    });
  }

  ngOnInit() {
    if (this.authService.getUser() != null || undefined) {
      this.getNumOfUnreadNotifications();
      const userId = this.getUserObject().id;
      this.getUser(userId);
      this.getRoles();
    }
  }

  getUser(userId: string) {
    this.userService.getUser(userId).subscribe(
      (user: user) => {
        this.user = user;
        this.userPic = user.profilePhoto;
      },

      (error: any) => {
        console.error(error);
      }
    );
  }

  getUserObject() {
    return this.authService.getUser();
  }

  navigateToSearch() {
    this.router.navigate([`/notifications-search`]);
  }
}
