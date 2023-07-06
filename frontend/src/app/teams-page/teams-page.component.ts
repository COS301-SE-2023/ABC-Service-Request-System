import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { user } from  '../../../../backend/src/models/user.model'
import { GroupService } from '../../services/group.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-teams-page',
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.scss']
})
export class TeamsPageComponent {
  groupId!: string;
  users: user[] = [];

  constructor(private router: Router, public authService: AuthService,
    private groupService: GroupService, private userService: UserService) {}

  onGroupSelected(groupId: string): void {
    this.groupService.getUsersByGroupId(groupId).subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
