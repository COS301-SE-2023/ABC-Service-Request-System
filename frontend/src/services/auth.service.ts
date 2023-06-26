import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { user } from '../../../backend/src/models/user.model';

interface DecodedToken {
  user: user;
  role: string;
  name: string;
  // other properties...
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private role: string;
  private name: string;
  private token: string | null;
  private user!: user;

  constructor(private http: HttpClient, private userService: UserService) {
    this.role = '';
    this.name = '';
    this.token = localStorage.getItem('token'); // retrieve token from localStorage

    if (this.token) {
      this.decodeToken(); // decode token if it exists
    }
  }

  setToken(token: string): void {
    this.token = token; // Set the token
    localStorage.setItem('token', token); // Also store it in local storage
    this.decodeToken(); // Decode the token
  }

  decodeToken(): void {
    if (!this.token) return; // if token is not set, do nothing

    const decodedToken = jwt_decode(this.token) as DecodedToken;
    this.role = decodedToken.role;
    this.name = decodedToken.name;
    this.user = decodedToken.user;
    // console.log('Decoded role:', this.role);
    // console.log('Decoded name:', this.name);
  }

  getRole(): string {
    return this.role;
  }

  getName(): string {
    return this.name;
  }

  getUser(): user {
    return this.user;
  }

  isAdmin(): boolean {
    //console.log('Role:', this.role);
    return this.role === 'Admin';
  }

  isManager(): boolean {
    //console.log('Role:', this.role);
    return this.role === 'Manager';
  }

  isTechnical(): boolean {
    //console.log('Role:', this.role);
    return this.role === 'Technical';
  }

  isFunctional(): boolean {
    //console.log('Role:', this.role);
    return this.role === 'Functional';
  }

  createUser(userDetails: any) {
    const API_URL = 'http://localhost:3000/api/user'; // Replace with your API URL
    return this.http.post(`${API_URL}/create_user`, userDetails);
  }
}
