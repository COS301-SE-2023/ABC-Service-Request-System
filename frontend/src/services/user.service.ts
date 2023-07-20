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

  //get all users
  getAllUsers(): Observable<user[]> {
    return this.http.get<user[]>(this.API_URL);
  }

  getUserById(id: string): Observable<user> {
    return this.http.get<user>(`${this.API_URL}/${id}`);
  }


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

  // updateUserProfilePicture(file: File, email: string): Observable<user> {
  //   alert(file.name);
  //   const url = `${this.API_URL}/update_profile_picture`;
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('email', email);
  //   return this.http.put<user>(url, formData);
  // }

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

  deleteUserGroup(userId: string, groupId: string): Observable<any> {
    console.log(userId);
    return this.http.delete(`${this.API_URL}/${userId}/group/${groupId}`);
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(`${this.API_URL}/upload`, formData);
  }

  updateProfilePicture(userId: string, url: string) {
    // console.log('in service');
    return this.http.put(`${this.API_URL}/updateProfilePicture`, { userId, url });
  }

  updateProfileHeader(userId: string, url: string) {
    return this.http.put(`${this.API_URL}/updateProfileHeader`, { userId, url });
  }

  updateBio(userId: string, bio: string) {
    return this.http.put(`${this.API_URL}/updateBio`, { userId, bio });
  }

  updateGithub(userId: string, githubLink: string) {
    return this.http.put(`${this.API_URL}/updateGithub`, { userId, githubLink });
  }

  updateLinkedin(userId: string, linkedinLink: string) {
    return this.http.put(`${this.API_URL}/updateLinkedin`, { userId, linkedinLink });
  }




}
