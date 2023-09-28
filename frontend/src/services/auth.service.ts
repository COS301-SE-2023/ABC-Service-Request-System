import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { user } from "../../../backend/users/src/models/user.model";
import { environment } from '../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { client } from '../../../backend/clients/src/models/client.model';

interface DecodedToken {
  user: user;
  role: string[];
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private selectedProjectSource = new BehaviorSubject<any>(null);
  selectedProject$ = this.selectedProjectSource.asObservable();

  setSelectedProject(project: any) {
    this.selectedProjectSource.next(project);
  }

  USER_URL = environment.USER_URL;

  private role: string[] = [];
  private name: string;
  private token: string | null;
  private user!: user;

  private loggedInClientSubject: BehaviorSubject<client | null>;

  constructor(private http: HttpClient, private userService: UserService) {
    this.name = '';
    this.token = localStorage.getItem('token'); // retrieve token from localStorage

    if (this.token) {
      this.decodeToken(); // decode token if it exists
    }

    const storedClientData = localStorage.getItem('loggedInClient');
    this.loggedInClientSubject = new BehaviorSubject<client | null>(
      storedClientData ? JSON.parse(storedClientData) : null
    );
  }

  setLoggedInClient(client: client): void {
    this.loggedInClientSubject.next(client);
    localStorage.setItem('loggedInClient', JSON.stringify(client));
  }

  getLoggedInClient(): Observable<any> {
    return this.loggedInClientSubject.asObservable();
  }

  setToken(token: string): void {
    this.token = token; // Set the token
    localStorage.setItem('token', token); // Also store it in local storage
    this.decodeToken(); // Decode the token
  }

  decodeToken(): void {
    if (!this.token) return; // if token is not set, do nothing

    const decodedToken = jwt_decode(this.token) as DecodedToken;
    this.role = decodedToken.role || [];
    this.name = decodedToken.name;
    this.user = decodedToken.user;
  }

  getToken(): string | null{
    return this.token;
  }



  getRole(): string []{
    return this.role;
  }

  getName(): string {
    return this.name;
  }

  getUser(): user {
    return this.user;
  }

  updateUserData(newUser: user) {
    this.user = newUser;
  }

  getUserObject() {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    // console.log('user email: ', this.getUser().emailAddress);
    const API_URL = `${this.USER_URL}/email`; // Replace with your API URL
    return this.http.get<user>(`${API_URL}?email=${this.getUser().emailAddress}`, { headers });
  }

  getUserNameByEmail(emailAddress: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const API_URL = `${this.USER_URL}/email`;
    return this.http.get<user>(`${API_URL}?email=${emailAddress}`, { headers });
  }

  isAdmin(): boolean {
    //console.log('Role:', this.role);
    return this.role.includes('Admin');
  }

  isManager(): boolean {
    //console.log('Role:', this.role);
    return this.role.includes('Manager');
  }

  isTechnical(): boolean {
    //console.log('Role:', this.role);
    return this.role.includes('Technical');
  }

  isFunctional(): boolean {
    //console.log('Role:', this.role);
    return this.role.includes('Functional');
  }

  createUser(userDetails: any) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage create_user:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const API_URL = this.USER_URL; // Replace with your API URL
    return this.http.post(`${API_URL}/create_user`, userDetails, { headers });
  }
}
