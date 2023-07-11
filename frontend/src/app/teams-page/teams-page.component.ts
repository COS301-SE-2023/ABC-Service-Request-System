import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserModel, user } from  '../../../../backend/src/models/user.model'
import { GroupService } from '../../services/group.service';
import { UserService } from 'src/services/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { group } from '../../../../backend/src/models/group.model'

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
  selectedGroup!: group;

  userImages: Map<string, string> = new Map();

  isModalVisible = false;
  // selectedGroup: any = null;


  constructor(private router: Router, public authService: AuthService,
    private groupService: GroupService, private userService: UserService,
    private changeDetector: ChangeDetectorRef) {}

  onGroupSelected(groupId: string): void {
    this.groupId = groupId;
    this.groupService.getUsersByGroupId(groupId).subscribe(
      (response) => {
        this.users = response;
        this.users.forEach(user => {
          console.log(user.profilePhoto);
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
    this.userService.getAllUsers().subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.log(error);
      }
    );

    const user = this.authService.getUser();
    if (user) {
      user.groups.forEach(groupId => {
        this.groupService.getGroupById(groupId).subscribe(group => {
          this.groups.push(group);
        });
      });
    } else {
      this.authService.getUserObject().subscribe(user => {
        user.groups.forEach(groupId => {
          this.groupService.getGroupById(groupId).subscribe(group => {
            this.groups.push(group);
          });
        });
      });
    }

    if (this.authService.isManager() || this.authService.isAdmin()) {
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


  removeGroup(group: group): void {

    // if (group.people) {
    //   for (const user of group.people) {
    //     const user1 = this.userService.getUserById(user);
    //     console.log(user1);
    //     // this.userService.deleteUserGroup(user1.id, group.id).subscribe(
    //     //   (response) => {
    //     //     console.log(response);
    //     //   },
    //     //   (error:Error) => {
    //     //     console.log(error);
    //     //   }
    //     // );
    //   }
    // }

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
    console.log('from frontend ' + user.emailAddress);
    // if (!this.groupId) {
    //   this.userService
    // }
    this.groupService.removeUserFromGroup(this.groupId, user).subscribe(
      (response) => {
        // this.users = this.users.filter(u => u.id !== user.id);
        this.onGroupSelected(this.groupId);
        location.reload();
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

}
