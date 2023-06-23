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

  constructor(private router: Router, private userService: UserService, private authService: AuthService) { }

  navigateToDashboard(event: Event) {
    event.preventDefault();
    this.router.navigate(['/dashboard']);
  }

  loginUser(): void {
    // alert("email is: " + this.email + " pass is: " + this.password);
    this.userService.loginUser({ emailAddress: this.email, password: this.password }).subscribe({
      next: (response: any) => {
        console.log('Login response:', response); // Log the response for debugging
        const token = response.token; // Assuming the token is returned in the response
        this.authService.decodeToken(token);
        console.log('Role:', this.authService.getRole()); // Log the role for debugging
        
        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => console.error(error),
    });
  }
}
