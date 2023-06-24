import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { user } from "../../../backend/src/models/user.model";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  USER_URL = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient, private router: Router) { }
  getUser(userID: string)
  {
    return this.http.get<user>(`${this.USER_URL}/${userID}`);
  }

  updateProfile(userId: string, name: string,surname: string, email: string) {
    const url = `${this.USER_URL}/${userId}`;//`${this.USER_URL}/${userId}`
    const body = { name,surname, email };
    return this.http.put(url, body);
  }
}
