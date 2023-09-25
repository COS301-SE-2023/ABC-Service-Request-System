import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { user } from "../../../backend/users/src/models/user.model";
import { Observable, tap } from "rxjs";
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  API_URL = environment.API_URL; // replace with your API URL
  LOGIN_URL = environment.LOGIN_URL;
  USER_UPLOAD_URL = environment.USER_UPLOAD_URL;
  FRONTEND_LOGIN_URL = environment.FRONTEND_LOGIN_URL;

  private token!: string | null;

  // private userDB = [
  //   { groupId: 1,
  //     id: '01',
  //     name: 'Edwin',
  //     surname: 'Chang',
  //     profilePhoto: 'img.png',
  //     emailAddress: 'edwin@gmail.com',
  //     emailVerified: 'true',
  //     password: '12345',
  //     roles: 'Technical',
  //     groups: 'Lemur',
  //     inviteToken?: '1234',
  //     bio: 'dev from hyperion tech',
  //     backgroundPhoto: 'image.png',
  //     facebook: 'link',
  //     github: 'link',
  //     linkedin: 'link',
  //     instagram: 'link',
  //     location: 'link',
  //   }
  // ]
  constructor(private http: HttpClient, private router : Router) { }

  //get all users
  getAllUsers(): Observable<user[]> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<user[]>(this.API_URL, {headers});
  }

  getUserById(id: string): Observable<user> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<user>(`${this.API_URL}/${id}`, {headers});
  }


  getUser(userID: string)
  {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<user>(`${this.API_URL}/id?id=${userID}`, {headers});
  }

  // Edwin's Function
  getUserForNotifications(userId: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<user>(`${this.API_URL}/${userId}` , {headers});
  }

  updateProfileName(name: string, email: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const url = `${this.API_URL}/update_user_name`;
    const body = { name, email };
    return this.http.put(url, body, {headers});
  }

  updateProfileLocation(location: string,email: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const url = `${this.API_URL}/update_user_location`;
    const body = { location,email };

    return this.http.put<user>(url, body, {headers});
  }

  updateProfileFB(facebook: string,email: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const url = `${this.API_URL}/update_user_facebook`;
    const body = { facebook,email };
    return this.http.put<user>(url, body, {headers});
  }

  updateProfileIG(instagram: string,email: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const url = `${this.API_URL}/update_user_instagram`;
    const body = { instagram,email };
    return this.http.put<user>(url, body, {headers});
  }

  updateProfileLI(linkedin: string,email: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const url = `${this.API_URL}/update_user_linkedin`;
    const body = { linkedin,email };
    return this.http.put<user>(url, body, {headers});
  }

  updateProfileGH(github: string,email: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const url = `${this.API_URL}/update_user_github`;
    const body = { github,email };
    return this.http.put<user>(url, body, {headers});
  }

  updateProfilePassword(password: string,email: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const url = `${this.API_URL}/update_user_password`;
    const body = { password,email };
    return this.http.put<user>(url, body, {headers});
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
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.post(`${this.API_URL}/get_user_by_token`, { token }, { headers });
  }

  activateAccount(accountDetails: { inviteToken: string, password: string }): Observable<any> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.post(`${this.API_URL}/activate_account`, accountDetails, { headers })
      .pipe(
        tap((response: any) => {
          if (response.message === 'Account activated successfully') {
            this.router.navigateByUrl(this.FRONTEND_LOGIN_URL);
          }
        })
      );
  }

  createUser(userDetails: any) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage create_user:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.post(`${this.API_URL}/create_user`, userDetails, { headers });
  }

  loginUser(userDetails: { emailAddress: string, password: string }) {
    //("called login at route: ", this.API_URL);
    return this.http.post(`${this.API_URL}/login`, userDetails);
  }

  deleteUserGroup(userId: string, groupId: string): Observable<any> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    //(userId);
    return this.http.delete(`${this.API_URL}/${userId}/group/${groupId}`, { headers });
  }

  uploadFile(file: File) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(this.USER_UPLOAD_URL, formData);
  }

  updateProfilePicture(userId: string, url: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    // //('in service');
    return this.http.put(`${this.API_URL}/updateProfilePicture`, { userId, url }, { headers });
  }

  updateProfileHeader(userId: string, url: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.put(`${this.API_URL}/updateProfileHeader`, { userId, url } , { headers });
  }

  updateBio(userId: string, bio: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.put(`${this.API_URL}/updateBio`, { userId, bio }, { headers });
  }

  updateGithub(userId: string, githubLink: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.put(`${this.API_URL}/updateGithub`, { userId, githubLink }, { headers });
  }

  updateLinkedin(userId: string, linkedinLink: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.put(`${this.API_URL}/updateLinkedin`, { userId, linkedinLink }, { headers });
  }

  addGroupToUser(userId: string, groupId: string): Observable<user> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.post<user>(`${this.API_URL}/addGroup`, { userId, groupId }, {headers}).pipe(
      tap({
        next: () => ('Group added to user successfully'),
        error: (error) => console.error('Failed to add group to user', error),
      })
    );
  }

  getUsersByGroupId(groupId: string): Observable<user[]> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<user[]>(`${this.API_URL}/byGroup/${groupId}`, { headers });
  }

  getUserByEmail(email: string): Observable<user> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<user>(`${this.API_URL}/email/${encodeURIComponent(email)}`, { headers });
  }

  getUserByEmailNoObservable(email: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    //('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<user>(`${this.API_URL}/email/${encodeURIComponent(email)}`, { headers });
  }


}
