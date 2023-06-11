import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL = 'http://localhost:3000/api/user'; // replace with your API URL

  constructor(private http: HttpClient, private router : Router) { }

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
  
  // other methods...
}
