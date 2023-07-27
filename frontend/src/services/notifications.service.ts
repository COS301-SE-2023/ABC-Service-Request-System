import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { notifications } from "../../../backend/notifications/src/models/notifications.model";

@Injectable({
  providedIn: 'root'
})

export class NotificationsService {
  NOTIFICATIONS_URL = 'http://localhost:3000/api/notifications';

  constructor(private http: HttpClient, private router: Router) { }

  getAllNotifications() {
    return this.http.get<notifications[]>(this.NOTIFICATIONS_URL);
  }

  newNotification(profilePhotoLink: string, notificationMessage: string, creatorEmail: string, assignedEmail: string, ticketSummary: string, ticketStatus: string, notificationTime: Date, link: string, readStatus: string) {
    const body = {profilePhotoLink, notificationMessage, creatorEmail, assignedEmail, ticketSummary, ticketStatus, notificationTime, link, readStatus};
    return this.http.post(`${this.NOTIFICATIONS_URL}/newnotif`, body);
  }

  changeNotificationToRead(id: string, notificationsId: string) {
    const body = {id, notificationsId};
    return this.http.put(`${this.NOTIFICATIONS_URL}/changeToRead`, body);
  }

  changeNotificationToUnread(id: string) {
    const body = {id};
    return this.http.put(`${this.NOTIFICATIONS_URL}/changeToUnread`, body);
  }

  getNotificationById(id: string) {
    return this.http.get<notifications>(`${this.NOTIFICATIONS_URL}/id?id=${id}`);
  }
}
