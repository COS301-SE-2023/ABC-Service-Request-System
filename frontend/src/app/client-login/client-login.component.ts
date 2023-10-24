import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { ClientService } from 'src/services/client.service';

@Component({
  selector: 'app-client-login',
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.scss']
})

export class ClientLoginComponent {
  password = '';
  email = '';
  errorMessage: string | null = null;
  logInClicked = false;

  constructor(private router: Router, private clientService: ClientService, private authService: AuthService) {  }

  routeToLogin() {
    this.router.navigate(['/login']);
  }

  loginUser(): void {
    this.logInClicked = true;
    this.clientService.loginClient({ email: this.email, password: this.password }).subscribe({
      next: (response: any) => {
        console.log('Login response:', response);
        const token = response.token;
        this.authService.setToken(token); // set and decode the token
        console.log('Role:', this.authService.getRole());

        this.logInClicked = true;

        //set client observable
        this.authService.setLoggedInClient(response.client);

        // Navigate to dashboard
        console.log('Token', token);
        this.router.navigate(['/client-dashboard']);
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
