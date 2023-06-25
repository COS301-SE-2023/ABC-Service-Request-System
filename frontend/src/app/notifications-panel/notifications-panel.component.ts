import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationsService } from 'src/services/notifications.service';
import { notifications } from '../../../../backend/src/models/notifications.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent implements OnInit {
  constructor(private notificationsService: NotificationsService, private router: Router) {}

  allNotificationsArray: notifications[] = [];
  unreadNotificationsArray: notifications[] = [];

  @Input() notifications: notifications[] = [];

  getNotifications() {
    this.notificationsService.getAllNotifications().subscribe((response: notifications[]) => {
      this.allNotificationsArray = response;
      console.log(this.allNotificationsArray);
      return this.allNotificationsArray;
    });
  }

  ngOnInit(): void {
    this.getNotifications();
    console.log("Notifications works")
  }

  handleKeyup(event: KeyboardEvent, link: string) {
    if (event.key === 'Enter') {
      this.navigateToTicket(link);
    }
  }
  
  navigateToTicket(id: string) {
    this.router.navigate([`/ticket/${id}`]);
  }
}
