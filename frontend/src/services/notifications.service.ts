import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ticket } from "../../../backend/src/models/ticket.model";
import { notifications } from "../../../backend/src/models/notifications.model";

@Injectable({
  providedIn: 'root'
})

export class TicketsService {
  TICKET_URL = 'http://localhost:3000/api/ticket';
  NOTIFICATIONS_URL = 'http://localhost:3000/api/notifications';

  constructor(private http: HttpClient, private router: Router) { }

 /* getAllNotifications() {

  }

  getNotificationID() {
    return this.http.get<ticket>(`${this.TICKET_URL}/id?id=${objectId}`);
  }*/
}