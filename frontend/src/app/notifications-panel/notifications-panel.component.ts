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
  sortedUnreadNotificationsArray: notifications[] = [];
  readNotificationsArray: notifications[] = [];
  sortedReadNotificationsArray: notifications[] = [];

  @Input() notifications: notifications[] = [];

  getUnreadNotifications() {
    this.notificationsService.getAllNotifications().subscribe((response: notifications[]) => {
      this.allNotificationsArray = response;
      this.unreadNotificationsArray = this.allNotificationsArray.filter(notifications => notifications.readStatus === 'Unread');
      this.sortedUnreadNotificationsArray = this.unreadNotificationsArray.sort((a, b) => {
        return this.compareDates(a.notificationTime, b.notificationTime, false);
      });
    });
  }

  getReadNotifications() {
    this.notificationsService.getAllNotifications().subscribe((response: notifications[]) => {
      this.allNotificationsArray = response;
      this.readNotificationsArray = this.allNotificationsArray.filter(notification => notification.readStatus === 'Read');
      this.sortedReadNotificationsArray = this.readNotificationsArray.sort((a, b) => {
        return this.compareDates(a.notificationTime, b.notificationTime, false);
      });
    });
  }

  compareDates(a: Date, b: Date, isAsc: boolean) {
    if (a < b) {
      return isAsc ? -1 : 1;
    } else if (a > b) {
      return isAsc ? 1 : -1;
    } else {
      return 0;
    }
  }

  ngOnInit(): void {
    this.getUnreadNotifications();
    this.getReadNotifications();

    const unreadTab = document.querySelector('.unreadNotifications');
    unreadTab?.classList.add('active');
  }

  handleTabClick(event: MouseEvent): void {
    const clickedTab = event.target as HTMLElement;
    const tabHeaders = document.querySelectorAll('.notification-filter h3');
    tabHeaders.forEach(header => header.classList.remove('active'));
    clickedTab.classList.add('active');
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
