import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { user } from "../../../../backend/users/src/models/user.model";
import { GroupService } from '../../services/group.service';
import { UserService } from 'src/services/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { group } from '../../../../backend/groups/src/models/group.model';
import { UserModel } from '../../../../backend/users/src/models/user.model';
import { switchMap } from 'rxjs';
import { NavbarService } from 'src/services/navbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-teams-page',
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.scss']
})
export class TeamsPageComponent implements OnInit{
  groupId!: string;
  groupName!: string;
  users: user[] = [];
  filterValue = 'all';
  groups: group[] = [];
  selectedGroup: group = { id:'0', groupName: 'All groups', backgroundPhoto:'' };

  userImages: Map<string, string> = new Map();

  isModalVisible = false;
  isRemoveGroupOverlayOpened = false;
  isRemoveUserOverlayOpened = false;

  navbarIsCollapsed!: boolean;
  // selectedGroup: any = null;


  constructor(private router: Router, public authService: AuthService,
    private groupService: GroupService, private userService: UserService,
    private changeDetector: ChangeDetectorRef, private navbarService: NavbarService,
    private snackBar: MatSnackBar) {}

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
    });
  }

  onGroupSelected(groupId: string): void {
    this.groupId = groupId;
    this.userService.getUsersByGroupId(groupId).subscribe(
        (response) => {
            this.users = response;
            this.users.forEach(user => {
            this.userImages.set(user.id, user.profilePhoto);

            });
        },
        (error) => {
            console.log(error);
        }
    );

    this.groupService.getGroupNameById(groupId).subscribe(
      (response) => {
        console.log(response);
        console.log(response);
        console.log(typeof response); // check the type of response
        // this.groupName = response.groupName;
      },
      (error) => {
        console.log(error);
      }
    );

  }

  ngOnInit(): void {
    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
    });

    if (this.authService.isManager() || this.authService.isAdmin()) {
      this.groupService.getGroups().subscribe(
        (response) => {
          this.groups = response;
          console.log(this.groups);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      let i = 1;
      const user = this.authService.getUser();
      if (user) {
        user.groups.forEach(groupId => {
          this.groupService.getGroupById(groupId).subscribe(group => {
            this.groups.push(group);
            if (i == 1) {
              // this.selectedGroup = group;
              this.selectGroup(group)
              i++;
            }
          });
        });
      } else {
        this.authService.getUserObject().subscribe(user => {
          user.groups.forEach(groupId => {
            this.groupService.getGroupById(groupId).subscribe(group => {
              this.groups.push(group);
              if (i == 1) {
                // this.selectedGroup = group;
                this.selectGroup(group)
                i++;
              }
            });
          });
        });
      }
    }
  }


  @Output() openAddPeopleDialog: EventEmitter<void> = new EventEmitter<void>();
  onOpenAddPeopleDialog(): void {

    this.openAddPeopleDialog.emit();
  }

  getActionText(): string {
    return this.filterValue === 'all' ? 'View profile' : 'Remove';
  }

  getActionClasses(): string {
    return this.filterValue === 'all' ? 'text-blue-500 underline cursor-pointer' : 'text-red-500 hover:underline cursor-pointer text-left';
  }

  viewProfile(user: user): void {
    // this.router.navigate(['/user-profile', user.id]);
  }

  navigateToProfile(id: string) {
    console.log('in navigateToProfile, id = ' + id);
    this.router.navigate(['/view-profile'], { queryParams: { id: id } });
  }


  handleFilterChange(filterValue: string): void {
    this.users = [];
    this.groups = [];
    this.changeDetector.detectChanges();
    console.log(filterValue);

    if (filterValue === 'all') {
      this.filterValue = filterValue;
      this.groupService.getGroups().subscribe(
        (response) => {
          this.groups = response;
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (filterValue === 'group') {
      this.filterValue = filterValue;
      this.groupService.getGroups().subscribe(
        (response) => {
          this.groups = response;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  openDialog(group: group) {
    this.isModalVisible = true;
    this.selectedGroup = group;
  }

  userToRemoveName = '';
  userToRemoveObject!:user;
  toggleRemoveUserOverlay(vari:any, user:any):void {
    if (vari == null) {
      this.isRemoveUserOverlayOpened = false;
    } else {
      if (user) {
        this.isRemoveUserOverlayOpened = true;
        this.userToRemoveName = user.name + ' ' + user.surname;
        this.userToRemoveObject = user;

      }
    }
  }

  groupToRemoveName = '';
  groupToRemoveObject!: group;
  toggleRemoveGroupOverlay(vari:any, group:any):void {
    if (vari == null) {
      this.isRemoveGroupOverlayOpened = false;
    } else {
      if (group) {
        this.isRemoveGroupOverlayOpened = true;
        this.groupToRemoveName = group.groupName;
        this.groupToRemoveObject = group;
      }
    }

  }


  removeGroup(group: group): void {
    group.people?.forEach(userId => {
      this.userService.deleteUserGroup(userId, group.id).subscribe(
        (response) => {
          // Handle response
        },
        (error: Error) => {
          console.log(error);
        }
      );
    });

    this.groupService.deleteGroup(group.id).subscribe(
      (response) => {
        this.groups = this.groups.filter(g => g.id !== group.id);
        this.isRemoveGroupOverlayOpened = false;
        this.showSnackBar('Group: ' + this.groupToRemoveName + ' deleted!');
      },
      (error) => {
        console.log(error);
      }
    );

    this.isModalVisible = false;
    // this.selectedGroup = null;
  }

  closeModal() {
    this.isModalVisible = false;
    // this.selectedGroup = null;
  }

  removeUser(user: user): void {
    this.userService.getUserByEmail(user.emailAddress).pipe(
      switchMap((response: any) => {
        console.log('in removeUser, response: ' + response._id);
        // first, remove the user from the group
        return this.groupService.removeUserFromGroup(this.groupId, response._id).pipe(
          switchMap((groupResponse) => {
            console.log('search');
            console.log(groupResponse);
            // after the user is removed from the group, remove the group from the user
            return this.userService.deleteUserGroup(response._id, this.groupId);
          })
        );
      })
    ).subscribe(
      (userResponse) => {
        console.log(userResponse);
        this.onGroupSelected(this.groupId);
        this.isRemoveUserOverlayOpened = false;
        this.showSnackBar(this.userToRemoveName + ' has been removed from ' + this.selectedGroup.groupName);
        // location.reload();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  selectGroup(group: group): void {
    this.selectedGroup = group;
    this.onGroupSelected(group.id);
    // location.reload();
  }

  clickGroup(group: group): void {
    this.filterValue = 'group';
    this.selectedGroup = group;
    this.selectGroup(group);
    console.log('in click group, ' + group.groupName);
  }

  routeToAnalytics(): void {
    this.router.navigateByUrl('/analytics-page');
  }

}
