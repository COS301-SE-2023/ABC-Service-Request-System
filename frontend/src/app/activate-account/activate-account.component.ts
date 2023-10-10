import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ClientService } from 'src/services/client.service';
import { Router } from '@angular/router';
import { response } from 'express';
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

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private clientService: ClientService,
              private router: Router) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    if (!this.token) {
      console.log('Token is missing');
    } else {
      console.log(`Token is a ${this.token}`);
      this.userService.getUserByToken(this.token).subscribe((response: any) => {
        this.user.email = response.email;
      });
    }
  }

  resetPassword(): void {
    if (this.password === this.confirmPassword) {
      if (this.token) {

        if(this.router.url.includes('client')){
          console.log("found it");
          this.clientService.activateAccount({inviteToken: this.token, password: this.password}).subscribe({
            next: (response: any) => this.router.navigateByUrl("/client-login"),
            error: (error: any) => console.log(error),
          });
        }else {
          this.userService.activateAccount({ inviteToken: this.token, password: this.password }).subscribe({
            next: (response: any) => this.router.navigateByUrl("/login"),
            error: (error: any) => console.error(error),
          });
        }

      } else {
        console.log('Token is missing');
      }
    } else {
      console.log('Passwords do not match');
    }
  }
}
