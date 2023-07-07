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

  removeUserFromGroup(groupId: string, user: user): Observable<any> {
    return this.http.delete(`${this.GROUPS_URL}/${groupId}/user/${encodeURIComponent(user.emailAddress)}`);
  }

  getGroupNameById(groupId: string): Observable<string> {
    return this.http.get<string>(`${this.GROUPS_URL}/${groupId}/name`)
  }

  addUsersToGroup(groupId: number, users: user[]): Observable<any> {
    return new Observable<any>(observer => {
      this.getGroupObjectById(groupId).subscribe(
        (group: group | null) => {
          if (!group) {
            observer.error('Group not found');
            observer.complete();
            return;
          }

          const existingPeople = group.people || [];
          const updatedPeople = [...existingPeople, ...users.map(user => user._id)];
          const updatedGroup = { ...group, people: updatedPeople };

          this.deleteGroupById(groupId).subscribe(
            () => {
              this.createGroup(updatedGroup).subscribe(
                () => {
                  observer.next('Users added successfully');
                  observer.complete();
                },
                error => {
                  observer.error('Failed to create group');
                  observer.complete();
                }
              );
            },
            error => {
              observer.error('Failed to delete group');
              observer.complete();
            }
          );
        },
        error => {
          observer.error('Failed to get group');
          observer.complete();
        }
      );
    });
  }

  private getGroupObjectById(groupId: number): Observable<group | null> {
    return new Observable<group | null>(observer => {
      this.getGroups().subscribe(
        (groups: group[]) => {
          const group = groups.find(g => parseInt(g.id) === groupId);
          observer.next(group || null);
          observer.complete();
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  private deleteGroupById(groupId: number): Observable<any> {
    return this.http.delete(`${this.GROUPS_URL}/${groupId}/delete`);
  }


}
