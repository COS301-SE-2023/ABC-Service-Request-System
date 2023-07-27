import { Component, OnInit} from '@angular/core';
import { UserService } from 'src/services/user.service';
import { user } from "../../../../backend/users/src/models/user.model";
import { AuthService } from 'src/services/auth.service';
import { Chart, registerables } from 'chart.js';
import { GroupService } from 'src/services/group.service';
import { group } from '../../../../backend/groups/src/models/group.model';
import { ActivatedRoute } from '@angular/router';
import { NavbarService } from 'src/services/navbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {

  constructor(private userService: UserService,
    private authService: AuthService,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private navbarService: NavbarService,
    private router: Router) {}

    currentUser!: user;
    tempUser!:user;
    userBio?:string;
    githubLink?:string;
    linkedinLink?:string;
    groups: group[] = [];

    navbarIsCollapsed!: boolean;

  ngOnInit() {
    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
    });

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      console.log(id);
      if (id) {
        this.userService.getUser(id).subscribe(user => {
          this.currentUser = user;
          this.userBio = this.currentUser.bio;
          this.githubLink = this.currentUser.github;
          this.linkedinLink = this.currentUser.linkedin;
          this.currentUser.groups.forEach(groupId => {
            this.groupService.getGroupById(groupId).subscribe(group => {
              this.groups.push(group);
            });
          });
        });
      }
    });
  }

  routeToAnalytics(): void {
    this.router.navigateByUrl('/analytics-page');
  }
}
