import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ticket } from "../../../backend/src/models/ticket.model";

@Injectable({
  providedIn: 'root'
})

export class TicketsService {
  TICKET_URL = 'http://localhost:3000/api/ticket';

  constructor(private http: HttpClient, private router: Router) { }

  getAllTickets(){
    return this.http.get<ticket[]>(this.TICKET_URL);
  }

  getTicketWithID(objectId: string){
    return this.http.get<ticket>(`${this.TICKET_URL}/id?id=${objectId}`);
  }

  makeAComment(ticketId: string, comment: string, author: string, type: string, attachmentUrl: string){
    const body = {ticketId, comment, author, type, attachmentUrl};
    return this.http.put(`${this.TICKET_URL}/comment`, body);
  }


  // Add Ticket Functionality
  addTicket(summary: string, assignee: string, assigned: string, group: string, priority: string, startDate: string, endDate: string, status: string, comments: string[]) {
    const body = {summary, assignee, assigned, group, priority, startDate, endDate, status, comments};
   // console.log('Ticket is added:' + body);
    return this.http.post(`${this.TICKET_URL}/addticket`, body);
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(`${this.TICKET_URL}/upload`, formData);
  }

  updateTicketStatus(ticketId: string, status: string) {
    const body = {ticketId, status};
    return this.http.put(`${this.TICKET_URL}/updateStatus`, body);
  }


}
