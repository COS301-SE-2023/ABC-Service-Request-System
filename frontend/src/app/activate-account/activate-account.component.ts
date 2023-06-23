import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {
  token: string | null = '';
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  password: string = '';
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  confirmPassword: string = '';
  user: { email: string } = { email: '' };

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    if (!this.token) {
      console.log('Token is missing');
    } else {
      console.log(`Token is ${this.token}`);
      this.userService.getUserByToken(this.token).subscribe((response: any) => {
        this.user.email = response.email;
      });
    }
  }

  resetPassword(): void {
    if (this.password === this.confirmPassword) {
      if (this.token) {
        this.userService.activateAccount({ inviteToken: this.token, password: this.password }).subscribe({
          next: (response: any) => console.log(response),
          error: (error: any) => console.error(error),
        });
      } else {
        console.log('Token is missing');
      }
    } else {
      console.log('Passwords do not match');
    }
  }
}
