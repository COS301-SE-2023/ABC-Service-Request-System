import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { group } from  '../../../backend/src/models/group.model'
import { user } from  '../../../backend/src/models/user.model'
import { Router } from '@angular/router';
import { ticket } from '../../../backend/src/models/ticket.model';


@Injectable({
  providedIn: 'root'
})

export class GroupService {

  GROUPS_URL = 'http://localhost:3000/api/group';

  constructor(private http: HttpClient, private router: Router) { }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(`${this.GROUPS_URL}/upload`, formData);
  }

  createGroup(group1: group): Observable<group> {
    console.log('in service, group object:');

    const groupName = group1.groupName;
    const backgroundPhoto = group1.backgroundPhoto;
    const people = group1.people;

    const group2 = {groupName, backgroundPhoto, people};
    console.log(group2);

    return this.http.post<group>(`${this.GROUPS_URL}/add`, group2).pipe(
      tap({
        next: () => console.log('Group created successfully'),
        error: (error) => console.error('Failed to create group', error),
      })
    );
  }

  addGroupToUser(userId: string, groupId: string): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/api/user/${userId}/add-group`, { groupId });
  }
/* THESE ARE DIFFERENT FUNCTIONS, DO NOT DELETE EITHER */
  addGroupToUsers(groupId: string, userIds: Array<string>): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/api/user/add-group-to-users`, { groupId, userIds });
  }


  getGroups(): Observable<group[]> {
    return this.http.get<group[]>(`${this.GROUPS_URL}`);
  }

  getUsersByGroupId(groupId: string): Observable<user[]> {
    return this.http.get<user[]>(`${this.GROUPS_URL}/${groupId}/users`);
  }

  getGroupForNotification(groupId: string) {
    return this.http.get<group[]>(`${this.GROUPS_URL}/groupId/${groupId}`);
  }

  removeUserFromGroup(groupId: string, user: user): Observable<any> {
    return this.http.delete(`${this.GROUPS_URL}/${groupId}/user/${encodeURIComponent(user.emailAddress)}`);
  }

  getGroupNameById(groupId: string): Observable<string> {
    return this.http.get<string>(`${this.GROUPS_URL}/${groupId}/name`);
  }

  addPeopleToGroup(group: group, people: user) {
    const body = {group, people};
    const url = `${this.GROUPS_URL}/add-people`
    console.log('hello from service');
    console.log(body);
    return this.http.put<any>(url, body)
  }

  getGroupById(groupId: string): Observable<group> {
    return this.http.get<group>(`${this.GROUPS_URL}/${groupId}`)
  }

  deleteGroup(groupId: string): Observable<any> {
    return this.http.delete(`${this.GROUPS_URL}/${groupId}/delete`)
  }

  getGroupsByUserId( groupId: string): Observable<group> {
    return this.http.get<group>(`${this.GROUPS_URL}/${groupId}`);
  }
  
  updateTicketsinGroup(groupId: string, ticketId: string): Observable<any> {
    return this.http.put<any>(`${this.GROUPS_URL}/update_tickets`, { ticketId , groupId });
  }
  
}
