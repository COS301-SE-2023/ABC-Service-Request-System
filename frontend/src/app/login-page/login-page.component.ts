import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent  {
  password = '';
  email = '';
  errorMessage: string | null = null;
  logInClicked = false;

  constructor(private router: Router, private userService: UserService, private authService: AuthService) {  }



  navigateToDashboard(event: Event) {
    event.preventDefault();
    this.router.navigate(['/dashboard']);
  }

  routeToClient() {
    this.router.navigate(['/client-login']);
  }

  loginUser(): void {
    this.logInClicked = true;
    this.userService.loginUser({ emailAddress: this.email, password: this.password }).subscribe({
      next: (response: any) => {
        console.log('Login response:', response);
        const token = response.token;
        this.authService.setToken(token); // set and decode the token
        console.log('Role:', this.authService.getRole());

        this.logInClicked = true;
        // Navigate to dashboard
        console.log('Token', token);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        console.error(error);

        if (error.status === 401) {
          // Unauthorized error (invalid email or password)
          this.errorMessage = "Invalid email or password";
          this.logInClicked = false;
        } else {
          // Other error occurred
          this.errorMessage = "User not found.";
          this.logInClicked = false;
        }
      },
    });
  }
}
