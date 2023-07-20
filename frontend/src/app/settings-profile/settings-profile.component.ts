import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { UserService } from 'src/services/user.service';
import { user } from '../../../../backend/src/models/user.model';
import { AuthService } from 'src/services/auth.service';
import { GroupService } from 'src/services/group.service';
import { group } from '../../../../backend/src/models/group.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.scss']
})
export class SettingsProfileComponent { // implements OnInit{

  currentUser!: user;
  tempUser!:user;
  groupIds: string[] = [];
  groups: group[] = [];
  headerPhoto = '';
  profileChanged = false;
  bioEditable = false;
  socialsEditable = false;

  profilePicture?: File;
  profileHeader?: File;
  userBio?: string;
  githubLink?: string;
  linkedinLink?: string;

  makeBioEditable() {
    this.bioEditable = true;
    this.profileChanged = true;
  }

  makeSocialsEditable() {
    this.socialsEditable = true;
    this.profileChanged = true;
  }

  constructor(private userService: UserService, private authService: AuthService,
  private groupService: GroupService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.authService.getUserObject().subscribe(
      (result: any) => {
        this.currentUser = result;
        this.groupIds = this.currentUser.groups;
        this.githubLink = this.currentUser.github;
        this.linkedinLink = this.currentUser.linkedin;
        // console.log(this.currentUser.groups, ' in ngoninit');
      }
    );

    this.tempUser = this.authService.getUser();
    // this.groupIds = this.authService.getUser().groups;
    if (this.tempUser) {
      // console.log('hi' + this.tempUser.groups);
      // this.githubLink = this.tempUser.github;
      // this.linkedinLink = this.tempUser.linkedin;
      this.tempUser.groups.forEach(groupId => {
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
          this.profilePicture = file;
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
          this.currentUser.headerPhoto = reader.result;
          this.profileHeader = file;
        }
      };
      this.profileChanged = true;
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    this.profileChanged = false;
    this.bioEditable = false;
    this.socialsEditable = false;

    if (this.profilePicture) {
      this.userService.uploadFile(this.profilePicture).subscribe(
        (result:any) => {
          const url = result.url;
          // console.log(url);
          this.userService.updateProfilePicture(this.currentUser.id, url).subscribe(
            (result:any) => {
              console.log(result);
              this.currentUser.profilePhoto = url;
              this.authService.updateUserData(this.currentUser);  // update local user data
              this.cdr.detectChanges();  // force Angular to re-render the component
              this.authService.getUserObject().subscribe(
                (result: any) => {
                  this.currentUser = result;
                  console.log(this.currentUser);
                }
              )
              this.profilePicture = undefined;
              alert('Profile picture updated');
            },
            (error: any) => {
              console.log('Error updating profile picture', error);
            }
          )
        },
        (error: any) => {
          console.log('Error uploading file', error);
        }
      )
    }

    if (this.profileHeader) {
      console.log('this.profileHeader');
      this.userService.uploadFile(this.profileHeader).subscribe(
        (result:any) => {
          const url = result.url;
          this.userService.updateProfileHeader(this.currentUser.id, url).subscribe(
            (result:any) => {
              console.log(result);
              this.currentUser.headerPhoto = url;
              this.authService.updateUserData(this.currentUser);  // update local user data
              this.cdr.detectChanges();  // force Angular to re-render the component
              this.authService.getUserObject().subscribe(
                (result: any) => {
                  this.currentUser = result;
                }
              )
              this.profileHeader = undefined;
              alert('Profile header updated');
            },
            (error: any) => {
              console.log('Error updating profile picture', error);
            }
          )
        },
        (error: any) => {
          console.log('Error uploading file', error);
        }
      )
    }

    if (this.userBio) {
      this.userService.updateBio(this.currentUser.id, this.userBio).subscribe(
        (result:any) => {
          console.log(result);
          this.currentUser.bio = this.userBio!;
          this.authService.updateUserData(this.currentUser);
          this.userBio = undefined;
          alert('Bio updated');
        },
        (error: any) => {
          console.log('Error updating bio', error);
        }
      )
    }

    if (this.githubLink) {
      this.userService.updateGithub(this.currentUser.id, this.githubLink).subscribe(
        (result:any) => {
          console.log(result);
          this.currentUser.github = this.githubLink!;
          this.authService.updateUserData(this.currentUser);
          this.githubLink = undefined;
          alert('Github link updated');
        },
        (error: any) => {
          console.log('Error updating Github link', error);
        }
      )
    }

    if (this.linkedinLink) {
      this.userService.updateLinkedin(this.currentUser.id, this.linkedinLink).subscribe(
        (result:any) => {
          console.log(result);
          this.currentUser.linkedin = this.linkedinLink!;
          this.authService.updateUserData(this.currentUser);
          this.linkedinLink = undefined;
          alert('LinkedIn link updated');
        },
        (error: any) => {
          console.log('Error updating LinkedIn link', error);
        }
      )
    }
  }
}
