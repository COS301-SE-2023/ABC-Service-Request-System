import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationsService } from 'src/services/notifications.service';
import { notifications } from "../../../../backend/notifications/src/models/notifications.model";
import { user } from "../../../../backend/users/src/models/user.model";
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
  creators!: user[];

  notificationsReady!: boolean;

  activeTab: "unread" | "read" = "unread";

  @Input() notifications: notifications[] = [];


  getUnreadNotifications() {
    // try {
    //   this.notificationsService.getAllNotifications().subscribe(async (response: notifications[]) => {
    //     this.allNotificationsArray = response;
    //     const user = this.authService.getUser();
    //     this.unreadNotificationsArray = this.allNotificationsArray.filter(notifications => notifications.readStatus === 'Unread' && notifications.assignedEmail === user.emailAddress);

    //     this.creators = [];

    //     const creatorPromises = this.unreadNotificationsArray.forEach((notification, i) => {
    //       return new Promise<void>((resolve, reject) => {
    //         this.authService.getUserNameByEmail(notification.creatorEmail).subscribe((userObject) => {
    //           this.creators.push({...userObject});

    //           console.log("Creators: ", this.creators);
    //           console.log("i: ", i);
    //           console.log("Creators[i]: ", this.creators[i].name);
    //           const creatorNames = this.creators[i].name + " " + this.creators[i].surname;
    //           this.unreadNotificationsArray[i].creatorEmail = creatorNames;
    //           resolve(); // Resolve the promise after the subscribe is done
    //         }, (error) => {
    //           reject(error); // Reject the promise if there's an error
    //         });
    //       });
    //     });

    //     await Promise.all(creatorPromises);

    //     this.sortedNotificationsArray = this.unreadNotificationsArray.sort((a, b) => {
    //       // console.log("Unread: ", this.unreadNotificationsArray);
    //       return this.compareDates(a.notificationTime, b.notificationTime, false);
    //     });
    //   });
    // }
    // catch (error: any) {
    //   console.log(error);
    // }

    this.notificationsService.getAllNotifications().subscribe(
      (response) => {
        this.allNotificationsArray = response;
        const user = this.authService.getUser();
        this.unreadNotificationsArray = this.allNotificationsArray.filter(notifications => notifications.readStatus === 'Unread' && notifications.assignedEmail === user.emailAddress);

        this.unreadNotificationsArray.forEach(notification => {
          const userEmail = notification.creatorEmail;

          this.authService.getUserNameByEmail(userEmail).subscribe(
            (response) => {
              notification.creatorEmail = response.name + " " + response.surname;
            }
          )
        });

        this.sortedNotificationsArray = this.unreadNotificationsArray.sort((a, b) => {
          this.notificationsReady = true;
          // console.log("Unread: ", this.unreadNotificationsArray);
          return this.compareDates(a.notificationTime, b.notificationTime, false);
        });

        
      }
    )

    
  }

  getReadNotifications() {
    this.notificationsService.getAllNotifications().subscribe(
      (response) => {
        this.allNotificationsArray = response;
        const user = this.authService.getUser();
        this.readNotificationsArray = this.allNotificationsArray.filter(notifications => notifications.readStatus === 'Read' && notifications.assignedEmail === user.emailAddress);

        this.readNotificationsArray.forEach(notification => {
          const userEmail = notification.creatorEmail;

          this.authService.getUserNameByEmail(userEmail).subscribe(
            (response) => {
              notification.creatorEmail = response.name + " " + response.surname;
            }
          )
        });

        this.notificationsReady = true;

        this.sortedNotificationsArray = this.readNotificationsArray.sort((a, b) => {
          // console.log("Unread: ", this.unreadNotificationsArray);
          return this.compareDates(a.notificationTime, b.notificationTime, false);
        });

      }
    )

    
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

    this.notificationsReady = false;
  }

  handleTabClick(tab: 'unread' | 'read') {
    this.activeTab = tab;

    if (this.activeTab === "unread") {
      this.getUnreadNotifications();
      this.notificationsReady = false;
    }

    if (this.activeTab === "read") {
      this.getReadNotifications();
      this.notificationsReady = false;
    }
  }

  // handleKeyup(event: KeyboardEvent, link: string, notificationsId: string) {
  //   if (event.key === 'Enter') {
  //     this.navigate(link, notificationsId);
  //   }
  // }

  updateReadStatusNotifications(id: string, notificationsId: string) {
    this.notificationsService.changeNotificationToRead(id, notificationsId).subscribe((response: any) => {
      console.log("Read Status Changed")
    })
  }

  async navigate(id: string, notificationsId: string) {
    try {
      // Update the notification so that it is read
      this.notification = await this.notificationsService.getNotificationById(notificationsId).toPromise() as notifications;
      console.log("this.notification: ", this.notification);

      if (this.notification.notificationMessage === " assigned an issue to you") {
        await this.updateReadStatusNotifications(id, notificationsId);
        await location.replace(`/ticket/${id}`);
      } else if (this.notification.notificationMessage === " assigned you to a group") {
        await this.updateReadStatusNotifications(id, notificationsId);
        await location.replace(`/teams`);
      } else if (
        this.notification.notificationMessage === " uploaded a document on a ticket" ||
        this.notification.notificationMessage === " commented on a ticket" ||
        this.notification.notificationMessage === " uploaded and commented on a ticket"
      ) {
        await this.updateReadStatusNotifications(id, notificationsId);
        await location.replace(`/ticket/${id}`);
      } else {
        // Handle other cases if needed.
      }
    } catch (error) {
      console.error("Failed to get notification or update read status:", error);
      // Handle error if needed.
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
}
