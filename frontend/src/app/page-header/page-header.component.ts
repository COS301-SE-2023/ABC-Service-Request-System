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
  styleUrls: ['./page-header.component.scss']
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

  constructor(private notificationsService: NotificationsService, private authService: AuthService, private userService: UserService, private router: Router, private elementRef: ElementRef) {}

  allNotificationsArray: notifications[] = [];
  unreadNotificationsArray: notifications[] = [];

  openNewTicketForm() {
    this.openForm.emit();
  }

  getNewId(): number {
    return this.tickets.length > 0 ? Math.max(...this.tickets.map(ticket => ticket.id)) + 1 : 1;
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

  openProfile() {
    this.showProfileForm = true;
    this.showNotificationsForm = false;
  }

  closeProfile() {
    this.showProfileForm = false;
  }

  closeForms() {
    this.showNotificationsForm = false;
    this.showProfileForm = false;
  }

  getNumOfUnreadNotifications() {
    this.notificationsService.getAllNotifications().subscribe((response: notifications[]) => {
      this.allNotificationsArray = response;
      const user = this.authService.getUser();
      this.unreadNotificationsArray = this.allNotificationsArray.filter(notifications => notifications.readStatus === 'Unread' && notifications.assignedEmail === user.emailAddress);
      this.unreadNotificationsCount = this.unreadNotificationsArray.length;
    });
  }

  getRoles() {
    if (this.authService.isAdmin()) {
      this.roles = "Admin";
      return this.roles; // Admin is already admin so won't have any other roles
    }

    if (this.authService.isManager()) {
      this.roles = "Management";

      if (this.authService.isFunctional()) {
        this.roles = this.roles + ", Functional";
      }

      if (this.authService.isTechnical()) {
        this.roles = this.roles + ", Technical";
      }

      return this.roles;
    }

    if (this.authService.isFunctional()) {
      this.roles = "Functional";

      if (this.authService.isTechnical()) {
        this.roles = this.roles + ", Technical";
      }

      return this.roles;
    }

    if (this.authService.isTechnical()) {
      this.roles = "Technical";

      return this.roles;
    }

    return "";
  }

  ngOnInit() {
    this.getNumOfUnreadNotifications();
    const userId = this.getUserObject().id;
    this.getUser(userId);
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

  getUserObject(){
    return this.authService.getUser();
  }

  navigateToSearch() {
    this.router.navigate([`/notifications-search`]);
  }
}
