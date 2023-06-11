import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL = 'http://localhost:3000/api/user'; // replace with your API URL

  constructor(private http: HttpClient) { }

  getUserByToken(token: string) {
    return this.http.post(`${this.API_URL}/get_user_by_token`, { token });
  }

  activateAccount(accountDetails: { inviteToken: string, password: string }) {
    return this.http.post(`${this.API_URL}/activate_account`, accountDetails);
  }

  createUser(userDetails: any) {
    return this.http.post(`${this.API_URL}/create_user`, userDetails);
  }
  
  // other methods...
}
