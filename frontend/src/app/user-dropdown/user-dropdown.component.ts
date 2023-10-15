import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GroupService } from 'src/services/group.service';
import { UserService } from 'src/services/user.service';
import { TicketsService } from 'src/services/ticket.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss']
})
export class UserDropdownComponent implements OnInit {
  currentUser: any;

  @Input() groupName: string | undefined;
  @Input() currentAssigned:string | undefined;
  currentAssignedImg: any;

  group: any;
  username: any;

  loadedUsers: any[] = [];
  ticketId: any;
  // assignedGroup = '';
  @Output() userSelected = new EventEmitter<any>();

  constructor(private groupService: GroupService, private authService: AuthService, private userService: UserService, private ticketService: TicketsService, private route: ActivatedRoute, private _snackBar: MatSnackBar,) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000, // milliseconds
      panelClass: ['custom-snackbar']
    });
  }

  ngOnInit() {
    this.authService.getUserObject().subscribe(
      (result: any) => {
        this.currentUser = result;
      },
      (error) => {
        console.log("Error fetching tickets for current user", error);
      });

    if (this.groupName) {
      this.groupService.getGroupByGroupName(this.groupName).subscribe(
        (groupData) => {
          this.group = groupData;
          // console.log(groupData);
          // this.assignedGroup = group
          this.loadUsers();
        },
        (error) => {
          console.error('Error fetching group:', error);
        }
      );
    }

    // console.log('in user-dropdown');
    // console.log(this.currentAssigned);
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
    this.ticketId = this.route.snapshot.paramMap.get('id');

  }

  selectedOption!: string | null;
  selectedImg!:string;
  isDropDownOpen = false;
  assignedChange = false;

  imgChange = false;
  user: any;

  selectOption(text: string | null, img: string, user: any){
    this.selectedOption = text;
    this.selectedImg = img;

    this.isDropDownOpen = false;
    this.assignedChange = true;
    this.imgChange = true;
    this.user = user;

    this.ticketService.updateCurrentAssigned(this.ticketId, this.user.emailAddress).subscribe(
      (response) => {
        console.log(response);
        this.ticketService.addHistory(this.ticketId, this.currentUser.name, this.currentUser.profilePhoto, this.currentAssigned!, this.currentAssignedImg, this.user.name, this.user.profilePhoto).subscribe(
          (response) => {
            console.log(response);
            this.currentAssigned = user.name;
            this.currentAssignedImg = user.profilePhoto;
            this.openSnackBar("Assigned user has been updated", "OK");
            this.userSelected.emit(user);
            // location.reload();
          },
          (error) => {
            console.error('Error updating ticket.history:', error);
          }
        );
      },
      (error) => {
        console.error('Error updating ticket.assigned:', error);
      }
    );

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
