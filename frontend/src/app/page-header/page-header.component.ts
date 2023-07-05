import { Component, EventEmitter, HostListener, Input, Output, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tickets } from '../data'
import { Ticket } from '../app.component';
import { notifications } from '../../../../backend/src/models/notifications.model'; 
import { NotificationsService } from 'src/services/notifications.service';

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

  constructor(private notificationsService: NotificationsService, private router: Router, private elementRef: ElementRef) {}

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
      this.unreadNotificationsArray = this.allNotificationsArray.filter(notifications => notifications.readStatus === 'Unread');
      this.unreadNotificationsCount = this.unreadNotificationsArray.length;
    });
  }

  ngOnInit() {
    this.getNumOfUnreadNotifications();
  }
}
