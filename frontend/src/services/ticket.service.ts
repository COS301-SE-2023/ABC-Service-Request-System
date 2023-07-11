import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ticket, attachment, TicketModel } from "../../../backend/src/models/ticket.model";
import { UserModel, user } from "../../../backend/src/models/user.model";
import { map, switchMap, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class TicketsService {
  TICKET_URL = 'http://localhost:3000/api/ticket';
  USER_URL: any;
  API_URL = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient, private router: Router) { }

  getAllTickets(){
    return this.http.get<ticket[]>(this.TICKET_URL);
  }

  getTicketWithID(objectId: string){
    return this.http.get<ticket>(`${this.TICKET_URL}/id?id=${objectId}`);
  }

  makeAComment(ticketId: string, comment: string, author: string, authorPhoto: string, type: string, attachment: attachment){
    const body = {ticketId, comment, author, authorPhoto, type, attachment};
    return this.http.put(`${this.TICKET_URL}/comment`, body);
  }

  // Add Ticket Functionality
  addTicket(summary: string,  description: string, assignee: string, assigned: string, group: string, priority: string, startDate: string, endDate: string, status: string, comments: string[]) {
    const body = {summary, description, assignee, assigned, group, priority, startDate, endDate, status, comments};
   console.log('Ticket is added service:', body);
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

  
  getActiveTicketsByUserId(userId: string) {
    return this.http.get<user>(`${this.API_URL}/id`, { params: { id: userId } }).pipe(
        switchMap(user => {
            console.log(user); // Log the user
            return this.http.get<ticket[]>(this.TICKET_URL).pipe(
                tap((tickets: any) => console.log(tickets)), // Log the tickets
                map(tickets => {
                    // Filter only the tickets that are active and assigned to the user
                    return tickets.filter((ticket: { status: string; assigned: string; }) => {
                        console.log(ticket); // Log each ticket
                        // Adjust this line to compare with user.name instead of user.id
                        return ticket.status === "Active" && ticket.assigned === user.name;
                    });
                })
            )
        })
    )
  }

  getPendingTicketsByUserId(userId: string) {
    return this.http.get<user>(`${this.API_URL}/id`, { params: { id: userId } }).pipe(
        switchMap(user => {
            console.log(user); // Log the user
            return this.http.get<ticket[]>(this.TICKET_URL).pipe(
                tap((tickets: any) => console.log(tickets)), // Log the tickets
                map(tickets => {
                    // Filter only the tickets that are active and assigned to the user
                    return tickets.filter((ticket: { status: string; assigned: string; }) => {
                        console.log(ticket); // Log each ticket
                        // Adjust this line to compare with user.name instead of user.id
                        return ticket.status === "Pending" && ticket.assigned === user.name;
                    });
                })
            )
        })
    )
  }

  getOverdueTicketsByUserId(userId: string) {
    return this.http.get<ticket[]>(`${this.API_URL}/overdueTickets/${userId}`);
  }
  
  getDueTodayTicketsByUserId(userId: string) {
    return this.http.get<ticket[]>(`${this.API_URL}/dueToday/${userId}`);
  }
  


}
