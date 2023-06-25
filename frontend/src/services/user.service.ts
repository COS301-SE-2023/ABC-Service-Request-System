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
    //alert(userID);
    return this.http.get<User>(`${this.USER_URL}/id?id=${userID}`);
  }

  updateProfileName(name: string, email: string) {
    const url = `${this.USER_URL}/update_user_name`;
    const body = { name, email };
    return this.http.put(url, body);
  }

  updateProfileSurname(surname: string,email: string) {
    const url = `${this.USER_URL}/update_user_surname`;
    const body = { surname,email };
    return this.http.put<User>(url, body);
  }

  updateProfilePassword(password: string,email: string) {
    const url = `${this.USER_URL}/update_user_password`;
    const body = { password,email };
    return this.http.put<User>(url, body);
  }

  updateUserProfilePicture(profilePicture: File, email: string): Observable<User> {
    const url = `${this.USER_URL}/update_profile_picture`;
    const formData = new FormData();
    formData.append('profilePicture',profilePicture);
    const body = { profilePicture, email}

    return this.http.put<User>(url, formData);
    
  }
}
