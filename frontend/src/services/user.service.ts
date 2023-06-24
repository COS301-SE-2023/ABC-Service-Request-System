import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../../backend/src/models/user.model";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})

export class UserService {
  USER_URL = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient, private router: Router) { }
  getUser(userID: string)
  {
    return this.http.get<User>(`${this.USER_URL}/${userID}`);
  }

  updateProfile(userId: string, data: FormData) {
    const url = `${this.USER_URL}/${userId}`;//`${this.USER_URL}/${userId}`
    const body = { data };
    return this.http.put(url, body);
  }

  updateUserProfilePicture(userId: string, profilePicture: File): Observable<User> {
    const url = `${this.USER_URL}/${userId}/profile-picture`;

    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    return this.http.put<User>(url, formData);
  }
}
