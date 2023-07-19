import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { UserService } from 'src/services/user.service';
import { user } from '../../../../backend/src/models/user.model';
import { AuthService } from 'src/services/auth.service';
import { GroupService } from 'src/services/group.service';
import { group } from '../../../../backend/src/models/group.model';
@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.scss']
})
export class SettingsProfileComponent { // implements OnInit{

  currentUser!: user;
  groupIds: string[] = [];
  groups: group[] = [];
  headerPhoto = '../../assets/bimg.jpg';
  profileChanged = false;
  bioEditable = false;

  makeBioEditable() {
      this.bioEditable = true;
      this.profileChanged = true;
  }

  constructor(private userService: UserService, private authService: AuthService,
  private groupService: GroupService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.groupIds = this.authService.getUser().groups;
    if (this.currentUser) {
      this.currentUser.groups.forEach(groupId => {
        this.groupService.getGroupById(groupId).subscribe(group => {
          this.groups.push(group);
        });
      });
    }
  }

  @ViewChild('fileUploader')
  fileUploader!: ElementRef;

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];

      // Show preview
      const reader = new FileReader();
      reader.onload = e => {
        if (typeof reader.result === 'string') {
          this.currentUser.profilePhoto = reader.result;
          this.userService.updateUserProfilePicture(file, this.currentUser.emailAddress);
        }
      };
      this.profileChanged = true;
      reader.readAsDataURL(file);
    }
  }

  @ViewChild('headerFileUploader')
  headerFileUploader!: ElementRef;

  onHeaderFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];

      // Show preview
      const reader = new FileReader();
      reader.onload = e => {
        if (typeof reader.result === 'string') {
          // this.currentUser.headerPhoto = reader.result;
          this.headerPhoto = reader.result;
        }
      };
      this.profileChanged = true;
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    this.profileChanged = false;
    this.bioEditable = false;
  }


}
