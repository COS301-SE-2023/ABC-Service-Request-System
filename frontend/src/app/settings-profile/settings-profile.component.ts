import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { UserService } from 'src/services/user.service';
import { user } from "../../../../backend/users/src/models/user.model";
import { AuthService } from 'src/services/auth.service';
import { GroupService } from 'src/services/group.service';
import { group } from '../../../../backend/groups/src/models/group.model';
import { ChangeDetectorRef } from '@angular/core';
import { NavbarService } from 'src/services/navbar.service';

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
  oldGithubLink?:string;
  oldLinkedinLink?:string;
  oldUserBio?:string;

  navbarIsCollapsed!: boolean;

  makeBioEditable() {
    this.bioEditable = true;
    this.profileChanged = true;
  }

  makeSocialsEditable() {
    this.socialsEditable = true;
    this.profileChanged = true;
  }

  constructor(private userService: UserService, private authService: AuthService,
  private groupService: GroupService, private cdr: ChangeDetectorRef, private navbarService: NavbarService) {}

  ngOnInit(): void {
    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
    });

    this.authService.getUserObject().subscribe(
      (result: any) => {
        this.currentUser = result;
        this.groupIds = this.currentUser.groups;
        this.githubLink = this.currentUser.github;
        this.linkedinLink = this.currentUser.linkedin;
        this.oldGithubLink = this.githubLink;
        this.oldLinkedinLink = this.linkedinLink;
        this.userBio = this.currentUser.bio;
        this.oldUserBio = this.userBio;
        // console.log(this.currentUser.groups, ' in ngoninit ');
        this.currentUser.groups.forEach(groupId => {
          this.groupService.getGroupById(groupId).subscribe(group => {
            this.groups.push(group);
          });
        });
      }
    );

    // this.tempUser = this.authService.getUser();
    // // this.groupIds = this.authService.getUser().groups;
    // if (this.tempUser) {
    //   // console.log('hi' + this.tempUser.groups);
    //   // this.githubLink = this.tempUser.github;
    //   // this.linkedinLink = this.tempUser.linkedin;
    //   this.tempUser.groups.forEach(groupId => {
    //     this.groupService.getGroupById(groupId).subscribe(group => {
    //       this.groups.push(group);
    //     });
    //   });
    // }

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

    if (this.userBio && (this.userBio != this.oldUserBio)) {
      this.userService.updateBio(this.currentUser.id, this.userBio).subscribe(
        (result:any) => {
          console.log(result);
          this.currentUser.bio = this.userBio!;
          this.authService.updateUserData(this.currentUser);
          // this.userBio = undefined;
          this.oldUserBio = this.userBio;
          alert('Bio updated');
        },
        (error: any) => {
          console.log('Error updating bio', error);
        }
      )
    }

    if (this.githubLink && (this.githubLink != this.oldGithubLink)) {
      this.userService.updateGithub(this.currentUser.id, this.githubLink).subscribe(
        (result:any) => {
          console.log(result);
          this.currentUser.github = this.githubLink!;
          this.authService.updateUserData(this.currentUser);
          this.oldGithubLink = this.githubLink;
          alert('Github link updated');
        },
        (error: any) => {
          console.log('Error updating Github link', error);
        }
      )
    }

    if (this.linkedinLink && (this.linkedinLink != this.oldLinkedinLink)) {
      this.userService.updateLinkedin(this.currentUser.id, this.linkedinLink).subscribe(
        (result:any) => {
          console.log(result);
          this.currentUser.linkedin = this.linkedinLink!;
          this.authService.updateUserData(this.currentUser);
          // this.linkedinLink = undefined;
          this.oldLinkedinLink = this.linkedinLink;
          alert('LinkedIn link updated');
        },
        (error: any) => {
          console.log('Error updating LinkedIn link', error);
        }
      )
    }
  }
}
