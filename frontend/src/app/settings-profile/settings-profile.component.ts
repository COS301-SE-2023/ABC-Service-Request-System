import { Component } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { User } from '../../../../backend/src/models/user.model';
@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.scss']
})
export class SettingsProfileComponent implements OnInit{
  user: User;
  profilePicture: File;

  constructor(private userService: UserService) {}

  ngOnInit() {
    const userId = '123'; // Replace with the actual user ID
    this.getUser(userId);
  }

  getUser(userId: string) {
    this.userService.getUser(userId).subscribe(
      (user: User) => {
        this.user = user;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  updateUser() {
    const userId = '123'; // Replace with the actual user ID
    const userData: FormData = new FormData();
    // Set the updated user data in the FormData object
    userData.append('name', 'John Doe');
    userData.append('surname','Example');
    userData.append('email', 'john@example.com');
    // Add more fields as needed

    this.userService.updateProfile(userId, userData).subscribe(
      (updatedUser: User) => {
        this.user = updatedUser;
      },
      (error: any) => {
        console.error(error);
      }
    );
}

  onProfilePictureChange(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.user.profilePhoto = files[0];
    }
  }

  updateProfilePicture() {
    if (!this.user.profilePhoto) {
      return;
    }

    const userId = '123'; // Replace with the actual user ID

    this.userService.updateUserProfilePicture(userId, this.profilePicture).subscribe(
      (updatedUser: User) => {
        this.user = updatedUser;
        // Reset the profilePicture variable
        this.profilePicture = null;
      },
      (error: any) => {
        console.error(error);
      }
    );
}
}