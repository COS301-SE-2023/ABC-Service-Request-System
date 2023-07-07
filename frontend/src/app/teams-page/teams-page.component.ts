import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { user } from  '../../../../backend/src/models/user.model'
import { GroupService } from '../../services/group.service';
import { UserService } from 'src/services/user.service';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(private router: Router, public authService: AuthService,
    private groupService: GroupService, private userService: UserService,
    private changeDetector: ChangeDetectorRef) {}

  onGroupSelected(groupId: string): void {
    this.groupId = groupId;
    this.groupService.getUsersByGroupId(groupId).subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.log(error);
      }
    );

    this.groupService.getGroupNameById(groupId).subscribe(
      (response) => {
        console.log(response);
        this.groupName = response;
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
    this.changeDetector.detectChanges();

    if (filterValue === 'all') {
      this.filterValue = filterValue;
      this.userService.getAllUsers().subscribe(
        (response) => {
          this.users = response;
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (filterValue === 'group') {
      this.filterValue = filterValue;
      this.userService.getAllUsers().subscribe(
        (response) => {
          this.users = [];
        },
        (error) => {
          console.log(error);
        }
      );

    }
  }

  removeUser(user: user): void {
    console.log('from frontend ' + user.emailAddress);
    // if (!this.groupId) {
    //   this.userService
    // }
    this.groupService.removeUserFromGroup(this.groupId, user).subscribe(
      (response) => {
        // Remove the user from the local users array
        // this.users = this.users.filter(u => u.id !== user.id);
        this.onGroupSelected(this.groupId);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
