import { Component, Input, OnInit } from '@angular/core';
import { GroupService } from 'src/services/group.service';
import { UserService } from 'src/services/user.service';


@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss']
})
export class UserDropdownComponent implements OnInit {
  @Input() groupName: string | undefined;
  group: any;
  loadedUsers: any[] = [];

  constructor(private groupService: GroupService, private userService: UserService) {}

  ngOnInit() {
    if (this.groupName) {
      // checkGroupNameExists
      this.groupService.getGroupByGroupName(this.groupName).subscribe(
        (groupData) => {
          this.group = groupData;
          console.log(groupData);
          this.loadUsers(); // Call a method to load users from 'people' array
        },
        (error) => {
          console.error('Error fetching group:', error);
        }
      );
    }
  }

  selectedOption!: string | null;
  selectedImg!:string;
  isDropDownOpen = false;

  selectOption(text: string | null){
    this.selectedOption = text;
    // this.selectedImg = img;
    this.isDropDownOpen = false;
  }

  toggleDropDown(){
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  loadUsers() {
    console.log('in loadUsers, ' + this.group.people);
    if (this.group && this.group.people) {
      for (const userId of this.group.people) {
        this.userService.getUserById(userId).subscribe(
          (userData) => {
            this.loadedUsers.push(userData);
          },
          (error) => {
            console.error('Error fetching user:', error);
          }
        );
      }
    }
  }
}
