import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationsService } from 'src/services/notifications.service';
import { notifications } from '../../../../backend/src/models/notifications.model';
import { user } from '../../../../backend/src/models/user.model';
import { UserService } from 'src/services/user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent implements OnInit {
  constructor(private notificationsService: NotificationsService, private userService: UserService, private authService: AuthService, private router: Router) {}

  allNotificationsArray: notifications[] = [];
  unreadNotificationsArray: notifications[] = [];
  sortedNotificationsArray: notifications[] = [];
  readNotificationsArray: notifications[] = [];
  notification!: notifications;

  activeTab: "unread" | "read" = "unread";

  @Input() notifications: notifications[] = [];


  getUnreadNotifications() {
    this.notificationsService.getAllNotifications().subscribe((response: notifications[]) => {
      this.allNotificationsArray = response;
      const user = this.authService.getUser();
      this.unreadNotificationsArray = this.allNotificationsArray.filter(notifications => notifications.readStatus === 'Unread' && notifications.assignedEmail === user.emailAddress);
      this.sortedNotificationsArray = this.unreadNotificationsArray.sort((a, b) => {
        // console.log("Unread: ", this.unreadNotificationsArray);
        return this.compareDates(a.notificationTime, b.notificationTime, false);
      });
    });
  }

  getReadNotifications() {
    this.notificationsService.getAllNotifications().subscribe((response: notifications[]) => {
      this.allNotificationsArray = response;
      const user = this.authService.getUser();
      this.readNotificationsArray = this.allNotificationsArray.filter(notifications => notifications.readStatus === 'Read' && notifications.assignedEmail === user.emailAddress);
      this.sortedNotificationsArray = this.readNotificationsArray.sort((a, b) => {
        // console.log("Read: ", this.readNotificationsArray);
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
    //console.log("Notifications Initialising");
    this.getUnreadNotifications();
  }

  handleTabClick(tab: 'unread' | 'read') {
    this.activeTab = tab;

    if (this.activeTab === "unread") {
      this.getUnreadNotifications();
    }
    
    if (this.activeTab === "read") {
      this.getReadNotifications();
    }
  }

  handleKeyup(event: KeyboardEvent, link: string, notificationsId: string) {
    if (event.key === 'Enter') {
      this.navigate(link, notificationsId);
    }
  }

  async updateReadStatusNotifications(id: string, notificationsId: string) {
    this.notificationsService.changeNotificationToRead(id, notificationsId).subscribe((response: any) => {
      console.log("Read Status Changed")
    })
  }
  
  navigate(id: string, notificationsId: string) {
    // update the notification so that it is read
    this.notificationsService.getNotificationById(notificationsId).subscribe((response: notifications) => {
      this.notification = response;
    });

    if (this.notification.notificationMessage === " assigned an issue to you") {
      this.updateReadStatusNotifications(id, notificationsId).then(() => {
        location.replace(`/ticket/${id}`);
      });
    }
    else if (this.notification.notificationMessage === " assigned you to a group") {
      this.updateReadStatusNotifications(id, notificationsId).then(() => {
        location.replace(`/ticket/${id}`);  // NB* This needs to change as well as the router and updateReadStatusNotifications
      });
    }
    else if (this.notification.notificationMessage === " uploaded a document on a ticket" ||
    this.notification.notificationMessage === " commented on a ticket" ||
    this.notification.notificationMessage === " uploaded and commented on a ticket") {

      this.updateReadStatusNotifications(id, notificationsId).then(() => {
        location.replace(`/ticket/${id}`);
      });
    }
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

  getCreatorName(emailAddress: string) {
    const user =  this.authService.getUserNameByEmail(emailAddress).subscribe((response: any) => {
      const name = response.name;
      console.log("Name: ", name);
      return name;
    });
    
  }
}
