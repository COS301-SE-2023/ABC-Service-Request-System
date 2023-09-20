import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { notifications } from "../../../backend/notifications/src/models/notifications.model";
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})

export class NotificationsService {
  NOTIFICATIONS_URL = environment.NOTIFICATION_URL;
  private token!: string | null;

  constructor(private http: HttpClient, private router: Router) { }

  getAllNotifications() {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<notifications[]>(this.NOTIFICATIONS_URL, {headers});
  }

  newNotification(profilePhotoLink: string, notificationMessage: string, creatorEmail: string, assignedEmail: string, ticketSummary: string, ticketStatus: string, notificationTime: Date, link: string, readStatus: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = {profilePhotoLink, notificationMessage, creatorEmail, assignedEmail, ticketSummary, ticketStatus, notificationTime, link, readStatus};
    return this.http.post(`${this.NOTIFICATIONS_URL}/newnotif`, body , {headers});
  }

  changeNotificationToRead(id: string, notificationsId: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = {id, notificationsId};
    return this.http.put(`${this.NOTIFICATIONS_URL}/changeToRead`, body , {headers});
  }

  changeNotificationToUnread(id: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = {id};
    return this.http.put(`${this.NOTIFICATIONS_URL}/changeToUnread`, body , {headers});
  }

  getNotificationById(id: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<notifications>(`${this.NOTIFICATIONS_URL}/id?id=${id}` , {headers});
  }
}
