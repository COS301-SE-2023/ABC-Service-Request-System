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
  readNotificationsArray: notifications[] = [];

  @Input() notifications: notifications[] = [];

  getUnreadNotifications() {
    this.notificationsService.getAllNotifications().subscribe((response: notifications[]) => {
      this.allNotificationsArray = response;
      this.unreadNotificationsArray = this.allNotificationsArray.filter(notifications => notifications.readStatus === 'Unread');
      return this.unreadNotificationsArray;
    });
  }

  getReadNotifications() {
    this.notificationsService.getAllNotifications().subscribe((response: notifications[]) => {
      this.allNotificationsArray = response;
      this.readNotificationsArray = this.allNotificationsArray.filter(notification => notification.readStatus === 'Read');
      return this.readNotificationsArray;
    });
  }

  ngOnInit(): void {
    this.getUnreadNotifications();
    this.getReadNotifications();
  }

  handleKeyup(event: KeyboardEvent, link: string) {
    if (event.key === 'Enter') {
      this.navigateToTicket(link);
    }
  }

  /*updateReadStatusNotifications(id: string) {

  }*/
  
  navigateToTicket(id: string) {
    this.router.navigate([`/ticket/${id}`]);

    // update the notification so that it is read
    //this.updateReadStatusNotifications(id);
  }

  getNotificationTime(notification: notifications): string {
    const notificationTime = new Date(notification.notificationTime);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - notificationTime.getTime();
  
    // Convert the time difference to minutes, hours, days, etc.
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }  
}
