import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  password = '';
  email = '';

  constructor(private router: Router, private userService: UserService) { }

  navigateToDashboard(event: Event) {
    event.preventDefault();
    this.router.navigate(['/dashboard']);
  }

  loginUser(): void {
    alert("email is: " + this.email + " pass is: " + this.password);
      this.userService.loginUser({ emailAddress: this.email, password: this.password }).subscribe({
        next: (response: any) => console.error(response),
        error: (error: any) => console.error(error),
      });
    }
}
