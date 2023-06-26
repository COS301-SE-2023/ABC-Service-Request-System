import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { user } from '../../../backend/src/models/user.model';

interface DecodedToken {
  user: user;
  role: string;
  // other properties...
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private role: string;
  private user!: user;

  constructor() { 
    this.role = '';
  }

  decodeToken(token: string): void {
    const decodedToken = jwt_decode(token) as DecodedToken;
    this.role = decodedToken.role;
    this.user = decodedToken.user;
    console.log('Decoded role:', this.role);
  }

  getRole(): string {
    return this.role;
  }

  getUser(): user {
    return this.user;
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
}
