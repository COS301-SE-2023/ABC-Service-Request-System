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
  @Input() currentAssigned:string | undefined;

  group: any;
  username: any;
  currentAssignedImg: any;
  loadedUsers: any[] = [];

  constructor(private groupService: GroupService, private userService: UserService) {}

  ngOnInit() {
    if (this.groupName) {
      this.groupService.getGroupByGroupName(this.groupName).subscribe(
        (groupData) => {
          this.group = groupData;
          // console.log(groupData);
          this.loadUsers();
        },
        (error) => {
          console.error('Error fetching group:', error);
        }
      );
    }

    console.log('in user-dropdown');
    console.log(this.currentAssigned);
    if (this.currentAssigned) {
      this.userService.getUserByEmail(this.currentAssigned).subscribe(
        (response) => {
          console.log(response);
          this.currentAssigned = response.name;
          this.currentAssignedImg = response.profilePhoto;
          // console.log(this.currentAssignedImg);
        },
        (error) => {
          console.error('Error fetching user:', error);
        }
      );
    }
    // this.currentAssigned = this.username;

  }

  selectedOption!: string | null;
  selectedImg!:string;
  isDropDownOpen = false;
  assignedChange = false;

  imgChange = false;

  selectOption(text: string | null){
    this.selectedOption = text;
    // this.selectedImg = img;
    // this.currentAssignedImg = image;
    this.isDropDownOpen = false;
    this.assignedChange = true;
    this.imgChange = true;
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
