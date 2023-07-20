// import { HttpClient } from "@angular/common/http";
// // import { Router } from "@angular/router";
// import { Injectable } from "@angular/core";
// import { ticket, attachment } from "../models/ticket.model";

// @Injectable({
//   providedIn: 'root'
// })

// export class TicketsService {
//   TICKET_URL = 'http://localhost:3000/api/ticket';
//   USER_URL: any;
//   API_URL = 'http://localhost:3000/api/user';

//   constructor(private http: HttpClient) { }

//   getAllTickets(){
//     return this.http.get<ticket[]>(this.TICKET_URL);
//   }

//   getTicketWithID(objectId: string){
//     return this.http.get<ticket>(`${this.TICKET_URL}/id?id=${objectId}`);
//   }

//   getTicketsWithName(userName: string) {
//     return this.http.get<ticket[]>(`${this.TICKET_URL}/assigned?id=${userName}`);
//   }

//   getAllProjectNamesForCurrentUserWithGroupName(groupName: string){
//     console.log('groupname service: ', groupName);
//     return this.http.get<string[]>(`${this.TICKET_URL}/projects?groupName=${groupName}`);
//   }

//   getTicketsWithGroupName(groupName: string) {
//     return this.http.get<ticket[]>(`${this.TICKET_URL}/group?name=${groupName}`);
//   }

//   makeAComment(ticketId: string, comment: string, author: string, authorPhoto: string, type: string, attachment: attachment){
//     const body = {ticketId, comment, author, authorPhoto, type, attachment};
//     return this.http.put(`${this.TICKET_URL}/comment`, body);
//   }

//   // Add Ticket Functionality
//   addTicket(summary: string,  description: string, assignee: string, assigned: string, group: string, priority: string, startDate: string, endDate: string, status: string, comments: string[], project: string) {
//     const body = {summary, description, assignee, assigned, group, priority, startDate, endDate, status, comments, project};
//    console.log('Ticket is added service:', body);
//     return this.http.post(`${this.TICKET_URL}/addticket`, body);
//   }

//   uploadFile(file: File) {
//     const formData = new FormData();
//     formData.append('file', file);

//     return this.http.post<{ url: string }>(`${this.TICKET_URL}/upload`, formData);
//   }

//   updateTicketStatus(ticketId: string, status: string) {
//     const body = {ticketId, status};
//     return this.http.put(`${this.TICKET_URL}/updateStatus`, body);
//   }

//   addTimeToFirstResponse(ticketId: string, commentTime: Date) {
//     return this.http.post(`${this.TICKET_URL}/addTimeToFirstResponse`, {ticketId, commentTime});
//   }

// }

import TicketRepository from "../repository/ticket.repository";

class TicketService {

  repository: TicketRepository;

  constructor(){
    this.repository = new TicketRepository();
  }

  async getAllTickets(){
    console.log("in ticket service");
    
    const tickets = await this.repository.getAllTickets();

    if(tickets) {
      return tickets;
    } else {
      throw new Error("Data Not found!");
    }
  }

}

export default TicketService;