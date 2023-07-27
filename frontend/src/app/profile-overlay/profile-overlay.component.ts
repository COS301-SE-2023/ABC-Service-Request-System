import { Component, OnInit } from '@angular/core';
import { user } from "../../../../backend/users/src/models/user.model";
import { UserService } from 'src/services/user.service';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-overlay',
  templateUrl: './profile-overlay.component.html',
  styleUrls: ['./profile-overlay.component.scss']
})
export class ProfileOverlayComponent implements OnInit {
  user!: user;
  userPic!: string;
  userName!: string;
  userSurname!: string;
  userEmail!: string;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit() {
    const user = this.getUserObject();
    if (user && user.id) {
      this.getUser(user.id);
    } else {
      console.error('User object or id is undefined');
    }
  }

  // ngOnInit() {
  //   const userId = this.getUserObject().id; // Replace with the actual user ID
  //   this.getUser(userId);
  // }

  getUser(userId: string) {

    this.userService.getUser(userId).subscribe(
      (user: user) => {
        this.user = user;
        this.userName = user.name;
        this.userSurname = user.surname;
        this.userEmail = user.emailAddress;
        this.userPic = user.profilePhoto;
      },

      (error: any) => {
        console.error(error);
      }
    );

  }

  getUserObject(){
    return this.authService.getUser();
  }

  openSettings() {
    this.router.navigate(['/settings']);
  }

  clearLocalStorage(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
