import { Component, OnInit} from '@angular/core';
import { UserService } from 'src/services/user.service';
import { user } from '../../../../backend/src/models/user.model';
import { AuthService } from 'src/services/auth.service';
import { Chart, registerables } from 'chart.js';
import { GroupService } from 'src/services/group.service';
import { group } from '../../../../backend/src/models/group.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {

  constructor(private userService: UserService,
    private authService: AuthService,
    private groupService: GroupService,
    private route: ActivatedRoute) {}

    currentUser!: user;
    tempUser!:user;
    userBio?:string;
    githubLink?:string;
    linkedinLink?:string;
    groups: group[] = [];

  ngOnInit() {
    // this.authService.getUserObject().subscribe(
    //   (result: any) => {
    //     this.currentUser = result;
    //     this.userBio = this.currentUser.bio;
    //     this.githubLink = this.currentUser.github;
    //     this.linkedinLink = this.currentUser.linkedin;
    //   }
    // );

    // this.tempUser = this.authService.getUser();
    // if (this.tempUser) {
    //   this.tempUser.groups.forEach(groupId => {
    //     this.groupService.getGroupById(groupId).subscribe(group => {
    //       this.groups.push(group);
    //     });
    //   });
    // }
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

}
