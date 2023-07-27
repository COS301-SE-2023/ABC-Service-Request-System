import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { notifications } from "../../../backend/notifications/src/models/notifications.model";

@Injectable({
  providedIn: 'root'
})

export class NotificationsService {
  NOTIFICATIONS_URL = 'http://localhost:3000/api/notifications';
  private token!: string | null;

  constructor(private http: HttpClient, private router: Router) { }

  getAllNotifications() {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<notifications[]>(this.NOTIFICATIONS_URL, {headers});
  }

  newNotification(profilePhotoLink: string, notificationMessage: string, creatorEmail: string, assignedEmail: string, ticketSummary: string, ticketStatus: string, notificationTime: Date, link: string, readStatus: string, creatorFullName: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = {profilePhotoLink, notificationMessage, creatorEmail, assignedEmail, ticketSummary, ticketStatus, notificationTime, link, readStatus, creatorFullName};
    return this.http.post(`${this.NOTIFICATIONS_URL}/newnotif`, body , {headers});
  }

  changeNotificationToRead(id: string, notificationsId: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = {id, notificationsId};
    return this.http.put(`${this.NOTIFICATIONS_URL}/changeToRead`, body , {headers});
  }

  changeNotificationToUnread(id: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = {id};
    return this.http.put(`${this.NOTIFICATIONS_URL}/changeToUnread`, body , {headers});
  }

  getNotificationById(id: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<notifications>(`${this.NOTIFICATIONS_URL}/:id?id=${id}` , {headers});
  }
}
