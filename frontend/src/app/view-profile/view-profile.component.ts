import { Component, OnInit} from '@angular/core';
import { UserService } from 'src/services/user.service';
import { user } from '../../../../backend/src/models/user.model';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  firstTimeName!: string;
  firstTimeSurname!:string;
  user!: user;
  profilePicture!: File;
  userPic!: string;

  constructor(private userService: UserService, private authService: AuthService) {}

  getUser(userId: string) {

    this.userService.getUser(userId).subscribe(
      (user: user) => {
        this.user = user;
        //console.log(this.user);
        this.firstTimeName = user.name;
        this.firstTimeSurname = user.surname;
      },

      (error: any) => {
        console.error(error);
      }
    );

  }

  ngOnInit() {
    const userId = this.getUserObject().id; // Replace with the actual user ID
    this.getUser(userId);
   console.log("hi");
   this.userService.getUser(userId).subscribe((user: user)=>{
   this.user = user;
   //this.editedName = user.name;
   //this.editedPicture = user.profilePhoto;
    // this.editedSurname = user.surname;
   });

   this.userPic = this.getUsersProfilePicture();
 }

 getUsersProfilePicture(){
  const user = this.authService.getUser();
  console.log("userrr", user);
  console.log("profile photo: " + user.profilePhoto);
  return this.user.profilePhoto;
}

getUserObject(){
  return this.authService.getUser();
}

}
