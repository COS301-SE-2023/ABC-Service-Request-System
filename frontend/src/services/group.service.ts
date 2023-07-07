import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { group } from  '../../../backend/src/models/group.model'
import { user } from  '../../../backend/src/models/user.model'
import { Router } from '@angular/router';


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

  createGroup(group1: group) {
    console.log('in service, group object:');
    // console.log(group1);

    const groupName = group1.groupName;
    const backgroundPhoto = group1.backgroundPhoto;
    const people = group1.people;

    const group2 = {groupName, backgroundPhoto, people};
    console.log(group2);

    return this.http.post<group>(`${this.GROUPS_URL}/add`, group2)
    .subscribe(
      () => {
        console.log('Group created successfully');
        // this.router.navigate(['/teams']);
      },
      error => {
        console.error('Failed to create group', error);
      }
    );
  }


  getGroups(): Observable<group[]> {
    return this.http.get<group[]>(`${this.GROUPS_URL}`);
  }

  getUsersByGroupId(groupId: string): Observable<user[]> {
    return this.http.get<user[]>(`${this.GROUPS_URL}/${groupId}/users`);
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

}
