/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ticket, attachment, TicketModel , worklog, WorklogEntry} from "../../../backend/tickets/src/models/ticket.model";
import { environment } from '../environments/environment';
import { Observable } from "rxjs";
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
  TICKET_HEALTH = environment.TICKET_HEALTH;


  private token!: string | null;

  constructor(private http: HttpClient, private router: Router) { }

  checkServerHealth(): Promise<boolean> {
    const url = `${this.TICKET_HEALTH}`;


    console.log('health url: ', url);

    return new Promise<boolean>((resolve) => {
      this.http.get(url, { responseType: 'text' }).subscribe(
        (response) => {
          console.log('returned true for health meaning false for failure');
          resolve(true);
        },
        (error) => {
          console.log('returned false for health meaning true for failure');
          resolve(false);
        }
      );
    });
  }

  generateTodoFromDescription(description: string) {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.post<string[]>(`${this.TICKET_URL}/generateTodoFromDescription`, { description }, {headers});
  }

  getAllTickets(){
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    // //('Bearer ${this.token}:', `Bearer ${this.token}`);
    // //('Ticket HEADER:', headers);
    return this.http.get<ticket[]>(this.TICKET_URL, {headers});
  }

  // getUserLatestWorklogs(username: string) {
  //   this.token = localStorage.getItem('token'); // retrieve token from localStorage
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  //   const url = `${this.API_URL}/api/worklogs/${username}`; // adjust this URL as per your backend route's path

  //   return this.http.get<worklog[]>(url, {headers});
  // }

  getTicketWithID(objectId: string){
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<ticket>(`${this.TICKET_URL}/id?id=${objectId}`, {headers});
  }

  getTicketsWithName(userName: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<ticket[]>(`${this.TICKET_URL}/assigned?id=${userName}`, {headers});
  }

  getTicketsWithProjectName(projectName: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<ticket[]>(`${this.TICKET_URL}/project?name=${projectName}`, {headers});
  }

  addWorkLogToTicket(ticketId: string, workLog: worklog) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.post<ticket>(`${this.TICKET_URL}/${ticketId}/worklogs`, workLog, {headers});
  }

  getAllProjectNamesForCurrentUserWithGroupName(groupName: string){
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<string[]>(`${this.TICKET_URL}/projects?groupName=${groupName}`, {headers});
  }

  getTicketsWithGroupName(groupName: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<ticket[]>(`${this.TICKET_URL}/group?name=${groupName}`, {headers});
  }

  makeAComment(ticketId: string, comment: string, author: string, authorPhoto: string, type: string, attachment: attachment){
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = {ticketId, comment, author, authorPhoto, type, attachment};
    return this.http.put(this.COMMENT_URL, body, {headers});
  }

  // Add Ticket Functionality
  addTicket(summary: string,  description: string, assignee: string, assigned: string, group: string, priority: string, startDate: string, endDate: string, status: string, comments: string[], project: string, todo: string[], todoChecked: boolean[]) {
    const body = {summary, description, assignee, assigned, group, priority, startDate, endDate, status, comments, project, todo, todoChecked};
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.post(`${this.TICKET_URL}/addticket`, body , {headers});
  }

  updateTodoChecked(id: string, todoChecked: boolean[]) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
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
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = {ticketId, status};
    return this.http.put(`${this.TICKET_URL}/updateStatus`, body , {headers});
  }

  addTimeToFirstResponse(ticketId: string, commentTime: Date) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.post(`${this.TICKET_URL}/addTimeToFirstResponse`, {ticketId, commentTime}, {headers});
  }

  generateTodosFromDescription(description: string) {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.post<string[]>(`${this.TICKET_URL}/generateTodoFromDescription`, { description }, {headers});
  }

  // getUserLatestWorklogs(username: string) {
  //   return this.http.get<worklog[]>(`${this.TICKET_URL}/latestworklogs/${username}`, {});
  // }

  getUserLatestWorklogs(username: string): Observable<WorklogEntry[]> {
    return this.http.get<WorklogEntry[]>(`${this.TICKET_URL}/latestworklogs/${username}`);
  }

  getUserLatestWorklogsByGroup(username: string, group: string): Observable<WorklogEntry[]> {
    return this.http.get<WorklogEntry[]>(`${this.TICKET_URL}/latestworklogsbygroup/${username}/${group}`);
  }

  updateCurrentAssigned(ticketId: string, newAssignedEmail: string) {
    console.log('in uopdateCurrentAssigned service' );
    console.log(ticketId);
    console.log(newAssignedEmail);

    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = {newAssignedEmail};
    return this.http.put(`${this.TICKET_URL}/${ticketId}/updateAssigned`, body, {headers});
  }

  addHistory(ticketId:string, personWhoChangedAssigned: string, personWhoChangedPhoto:string, prevAssignedName: string, prevAssignedPhoto:string, newAssignedName:string, newAssignedPhoto:string ) {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const body = {personWhoChangedAssigned, personWhoChangedPhoto, prevAssignedName, prevAssignedPhoto, newAssignedName, newAssignedPhoto};
    return this.http.post<any>(`${this.TICKET_URL}/${ticketId}/addHistory`,  body , {headers});
  }

  getTicketsForUser(emailAddress: string) {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get(`${this.TICKET_URL}/getTicketUserEmail?emailAddress=${emailAddress}`, {headers});
  }

  sendEmailNotification(emailAddresses: string[], ticketSummary: string, ticketId: string, endDate: string, priority: string, assigneeEmail: string, assignedEmail: string) {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const body = {emailAddresses, ticketSummary, ticketId, endDate, priority, assigneeEmail, assignedEmail};
    return this.http.post(`${this.TICKET_URL}/sendEmailNotification`, body, {headers});
  }
}
