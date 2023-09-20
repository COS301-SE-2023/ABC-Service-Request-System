import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';
import { group } from '../../../backend/groups/src/models/group.model';
import { user } from "../../../backend/users/src/models/user.model";
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class GroupService {

  GROUPS_URL = environment.GROUP_URL;
  GROUP_UPLOAD_URL = environment.GROUP_UPLOAD_URL;
  USER_URL = environment.USER_URL;

  private token!: string | null;

  constructor(private http: HttpClient, private router: Router) { }

  uploadFile(file: File) {
    //('in group service upload fikle');
    const formData = new FormData();
    formData.append('file', file);
    //(file.name);
    return this.http.post<{ url: string }>(this.GROUP_UPLOAD_URL, formData);
  }

  createGroup(group1: group): Observable<group> {
    //('in service, group object:');
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const groupName = group1.groupName;
    const backgroundPhoto = group1.backgroundPhoto;
    const people = group1.people;

    const group2 = {groupName, backgroundPhoto, people};
    //(group2);

    return this.http.post<group>(`${this.GROUPS_URL}/add`, group2, {headers}).pipe(
      tap({
        next: () => ('Group created successfully'),
        error: (error) => console.error('Failed to create group', error),
      })
    );
  }

  addGroupToUser(userId: string, groupId: string): Observable<any> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.post<any>(`${this.USER_URL}/${userId}/add-group`, { groupId } , {headers});
  }
/* THESE ARE DIFFERENT FUNCTIONS, DO NOT DELETE EITHER */
  addGroupToUsers(groupId: string, userIds: Array<string>): Observable<any> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.getGroupByObjectId(groupId).pipe(
        switchMap(group => {
            const actualGroupId = group.id;
            //('actual group id: ' + actualGroupId);
            return this.http.post<any>(`${this.USER_URL}/add-group-to-users`, { groupId: actualGroupId, userIds } , {headers});
        })
    );
  }

  getGroupByObjectId(groupId: string): Observable<any> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<any>(`${this.GROUPS_URL}/objectId/${groupId}`, {headers});
  }

  getGroups(): Observable<group[]> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<group[]>(`${this.GROUPS_URL}`, {headers});
  }

  getUsersByGroupId(groupId: string): Observable<user[]> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<user[]>(`${this.GROUPS_URL}/${groupId}/users`, {headers});
  }

  getGroupForNotification(groupId: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<group>(`${this.GROUPS_URL}/groupId/${groupId}`, {headers});
  }

  removeUserFromGroup(groupId: string, userId: string): Observable<any> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.delete(`${this.GROUPS_URL}/${groupId}/user/${userId}`, {headers});
  }


  getGroupNameById(groupId: string): Observable<any> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<any>(`${this.GROUPS_URL}/${groupId}/name`, {headers});
  }

  addPeopleToGroup(group: group, people: user) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const body = {group, people};
    const url = `${this.GROUPS_URL}/add-people`
    //('hello from service');
    //(body);
    return this.http.put<any>(url, body, {headers});
  }

  getGroupById(groupId: string): Observable<group> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<group>(`${this.GROUPS_URL}/${groupId}` , {headers})
  }

  deleteGroup(groupId: string): Observable<any> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.delete(`${this.GROUPS_URL}/${groupId}/delete`, {headers})
  }

  getGroupsByUserId( groupId: string): Observable<group> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<group>(`${this.GROUPS_URL}/${groupId}`, {headers});
  }

  updateTicketsinGroup(groupId: string, ticketId: string): Observable<any> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.put<any>(`${this.GROUPS_URL}/update_tickets`, { ticketId , groupId } , {headers});
  }

  checkGroupNameExists(groupName: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.GROUPS_URL}/exists/${groupName}`);
  }

  getGroupByGroupName(groupName: string):Observable<group> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<group>(`${this.GROUPS_URL}/getGroupByName/${groupName}`, {headers});
  }
}
