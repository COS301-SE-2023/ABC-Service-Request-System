import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GroupService {

  GROUPS_URL = 'http://localhost:3000/api/group';

  constructor(private http: HttpClient) { }

  createGroup(group: any): Observable<any> {
    return this.http.post(`${this.GROUPS_URL}/add`, group, { headers: { 'Content-Type': 'application/json' } });

  }
}
