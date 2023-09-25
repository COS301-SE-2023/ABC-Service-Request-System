import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ticket, attachment, TicketModel } from "../../../backend/tickets/src/models/ticket.model";
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})

export class TicketsService {

  API_URL = environment.API_URL; // replace with your API URL
  TICKET_URL = environment.TICKET_URL;
  COMMENT_URL = environment.COMMENT_URL;
  USER_UPLOAD_URL = environment.USER_UPLOAD_URL;
  GROUP_UPLOAD_URL = environment.GROUP_UPLOAD_URL;
  FRONTEND_LOGIN_URL = environment.FRONTEND_LOGIN_URL;

  private token!: string | null;

  constructor(private http: HttpClient, private router: Router) { }

  getAllTickets(){
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    // console.log('Bearer ${this.token}:', `Bearer ${this.token}`);
    // console.log('Ticket HEADER:', headers);
    return this.http.get<ticket[]>(this.TICKET_URL, {headers});
  }

  getTicketWithID(objectId: string){
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<ticket>(`${this.TICKET_URL}/id?id=${objectId}`, {headers});
  }

  getTicketsWithName(userName: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<ticket[]>(`${this.TICKET_URL}/assigned?id=${userName}`, {headers});
  }

  getTicketsWithProjectName(projectName: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<ticket[]>(`${this.TICKET_URL}/project?name=${projectName}`, {headers});
  }

  getAllProjectNamesForCurrentUserWithGroupName(groupName: string){
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<string[]>(`${this.TICKET_URL}/projects?groupName=${groupName}`, {headers});
  }

  getTicketsWithGroupName(groupName: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<ticket[]>(`${this.TICKET_URL}/group?name=${groupName}`, {headers});
  }

  makeAComment(ticketId: string, comment: string, author: string, authorPhoto: string, type: string, attachment: attachment){
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = {ticketId, comment, author, authorPhoto, type, attachment};
    return this.http.put(this.COMMENT_URL, body, {headers});
  }

  // Add Ticket Functionality
  addTicket(summary: string,  description: string, assignee: string, assigned: string, group: string, priority: string, startDate: string, endDate: string, status: string, comments: string[], project: string, todo: string[], todoChecked: boolean[]) {
    const body = {summary, description, assignee, assigned, group, priority, startDate, endDate, status, comments, project, todo, todoChecked};
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.post(`${this.TICKET_URL}/addticket`, body , {headers});
  }

  updateTodoChecked(id: string, todoChecked: boolean[]) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = { todoChecked };
    return this.http.put(`${this.TICKET_URL}/updateTodoChecked/${id}`, body, {headers});
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(this.GROUP_UPLOAD_URL, formData);
  }

  updateTicketStatus(ticketId: string, status: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = {ticketId, status};
    return this.http.put(`${this.TICKET_URL}/updateStatus`, body , {headers});
  }

  addTimeToFirstResponse(ticketId: string, commentTime: Date) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.post(`${this.TICKET_URL}/addTimeToFirstResponse`, {ticketId, commentTime}, {headers});
  }

  getTicketsForUser(emailAddress: string) {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get(`${this.TICKET_URL}/getTicketUserEmail?emailAddress=${emailAddress}`, {headers});
  }

  sendEmailNotification(emailAddresses: string[], ticketSummary: string, ticketId: string, endDate: string, priority: string, assigneePic: string, assigneeEmail: string, assignedPic: string, assignedEmail: string) {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = {emailAddresses, ticketSummary, ticketId, endDate, priority, assigneePic, assigneeEmail, assignedPic, assignedEmail};
    return this.http.post(`${this.TICKET_URL}/sendEmailNotification`, body, {headers});
  }
}
