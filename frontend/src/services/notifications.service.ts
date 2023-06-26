import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ticket } from "../../../backend/src/models/ticket.model";
import { notifications } from "../../../backend/src/models/notifications.model";

@Injectable({
  providedIn: 'root'
})

export class NotificationsService {
  TICKET_URL = 'http://localhost:3000/api/ticket';
  NOTIFICATIONS_URL = 'http://localhost:3000/api/notifications';

  constructor(private http: HttpClient, private router: Router) { }

  getAllNotifications() {
    return this.http.get<notifications[]>(this.NOTIFICATIONS_URL);
  }

  /*getNotificationID() {
    return this.http.get<ticket>(`${this.TICKET_URL}/id?id=${objectId}`);
  }*/

  newNotification(profilePhotoLink: string, notificationMessage: string, creatorEmail: string, assignedEmail: string, ticketSummary: string, ticketStatus: string, notificationTime: Date, link: string, readStatus: string) {
    const body = {profilePhotoLink, notificationMessage, creatorEmail, assignedEmail, ticketSummary, ticketStatus, notificationTime, link, readStatus};
    return this.http.post(`${this.NOTIFICATIONS_URL}/newnotif`, body);
  }
}