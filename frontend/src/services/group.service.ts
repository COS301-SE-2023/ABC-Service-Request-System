import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { group } from  '../../../backend/src/models/group.model'
import { user } from  '../../../backend/src/models/user.model'

@Injectable({
  providedIn: 'root'
})

export class GroupService {

  GROUPS_URL = 'http://localhost:3000/api/group';

  constructor(private http: HttpClient) { }

  createGroup(group: any): Observable<any> {
    return this.http.post(`${this.GROUPS_URL}/add`, group, { headers: { 'Content-Type': 'application/json' } });
  }

  getGroups(): Observable<group[]> {
    return this.http.get<group[]>(`${this.GROUPS_URL}`);
  }

  getUsersByGroupId(groupId: string): Observable<user[]> {
    return this.http.get<user[]>(`${this.GROUPS_URL}/${groupId}/users`);
  }
}
