import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { user } from "../../../backend/src/models/user.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL = 'http://localhost:3000/api/user'; // replace with your API URL
  LOGIN_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router : Router) { }

  //DASHES FUNCTIONS
  getUser(userID: string)
  {
    //alert(userID);
    return this.http.get<user>(`${this.API_URL}/id?id=${userID}`);
  }

  updateProfileName(name: string, email: string) {
    const url = `${this.API_URL}/update_user_name`;
    const body = { name, email };
    return this.http.put(url, body);
  }

  updateProfileSurname(surname: string,email: string) {
    const url = `${this.API_URL}/update_user_surname`;
    const body = { surname,email };
    return this.http.put<user>(url, body);
  }

  updateProfilePassword(password: string,email: string) {
    const url = `${this.API_URL}/update_user_password`;
    const body = { password,email };
    return this.http.put<user>(url, body);
  }

  updateUserProfilePicture(file: File, email: string): Observable<user> {
    alert(file.name);
    const url = `${this.API_URL}/update_profile_picture`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);

    return this.http.put<user>(url, formData);
  }
  //END DASH

  getUserByToken(token: string) {
    return this.http.post(`${this.API_URL}/get_user_by_token`, { token });
  }

  activateAccount(accountDetails: { inviteToken: string, password: string }) {
    const ret = this.http.post(`${this.API_URL}/activate_account`, accountDetails);

    if (ret.forEach) {
      ret.forEach((res: any) => {
        if (res.message === 'Account activated successfully') {
          this.router.navigateByUrl('http://localhost:4200/login');
        }
      });
    }
    return ret;
  }

  createUser(userDetails: any) {
    return this.http.post(`${this.API_URL}/create_user`, userDetails);
  }

  loginUser(userDetails: { emailAddress: string, password: string }) {
    return this.http.post(`${this.LOGIN_URL}/login`, userDetails);
  }

  // other methods...
}

//ignore
