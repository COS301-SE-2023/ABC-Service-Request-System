import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  password: string = '';
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  confirmPassword: string = '';
  user: { email: string } = { email: 'dummy@example.com' };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      // Handle error, such as displaying an error message
    }
  }

  resetPassword(): void {
    if (this.password === this.confirmPassword) {
      // Implement the logic to reset the password
      // Make API requests or perform necessary actions to reset the password
      console.log('Password reset');
    } else {
      // Passwords do not match, handle the error
      console.log('Passwords do not match');
    }
  }
}
