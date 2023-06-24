import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

interface DecodedToken {
  role: string;
  // other properties...
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private role: string;

  constructor(private http: HttpClient, private userService: UserService) { 
    this.role = '';
  }

  decodeToken(token: string): void {
    const decodedToken = jwt_decode(token) as DecodedToken;
    this.role = decodedToken.role;
    console.log('Decoded role:', this.role);
  }

  getRole(): string {
    return this.role;
  }

  isAdmin(): boolean {
    console.log('Role:', this.role);
    return this.role === 'Admin';
  }

  isManager(): boolean {
    console.log('Role:', this.role);
    return this.role === 'Manager';
  }

  isTechnical(): boolean {
    console.log('Role:', this.role);
    return this.role === 'Technical';
  }

  isFunctional(): boolean {
    console.log('Role:', this.role);
    return this.role === 'Functional';
  }

  createUser(userDetails: any) {
    const API_URL = 'http://localhost:3000/api/user'; // Replace with your API URL
    return this.http.post(`${API_URL}/create_user`, userDetails);
  }
  
}
