import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { user } from  '../../../../backend/src/models/user.model'

@Component({
  selector: 'app-teams-page',
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.scss']
})
export class TeamsPageComponent {
  users!: user[];

  constructor(private router: Router, public authService: AuthService) {}

  onGroupSelected(users: user[]): void {
    this.users = users;
  }
}
