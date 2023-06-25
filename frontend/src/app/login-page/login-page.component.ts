import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  password = '';
  email = '';
  errorMessage: string | null = null;

  constructor(private router: Router, private userService: UserService, private authService: AuthService) { }

  navigateToDashboard(event: Event) {
    event.preventDefault();
    this.router.navigate(['/dashboard']);
  }

  loginUser(): void {
    this.userService.loginUser({ emailAddress: this.email, password: this.password }).subscribe({
      next: (response: any) => {
        console.log('Login response:', response);
        const token = response.token;
        this.authService.decodeToken(token);
        console.log('Role:', this.authService.getRole());
  
        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        console.error(error);
  
        if (error.status === 401) {
          // Unauthorized error (invalid email or password)
          this.errorMessage = "Invalid email or password";
        } else {
          // Other error occurred
          this.errorMessage = "User not found.";
        }
      },
    });
  }
}
