import { Component, OnInit} from '@angular/core';
import { UserService } from 'src/services/user.service';
import { user } from '../../../../backend/src/models/user.model';
import { AuthService } from 'src/services/auth.service';
@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.scss']
})
export class SettingsProfileComponent implements OnInit{
  user!: user;
  profilePicture!: File;
  editedLocation!: string;
  firstTimeLocation!: string;
  firstTimeSurname!:string;
  firstTimeBio!:string;
  firstTimeFB!:string;
  firstTimeIG!:string;
  firstTimeLI!:string;
  firstTimeGH!:string;
  editedSurname!: string;
  editedBio!:string;
  editedPicture!: File;
  editedFB!:string;
  editedIG!:string;
  editedLI!:string;
  editedGH!:string;


  editingLocation = false;
  editingBio = false;
  editingPicture= false;
  editingSurname = false;
  editingFB = false;
  editingIG = false;
  editingGH = false;
  editingLI = false;

  isDirty = false;
  userPic!: string;
  //file: File | null = null;

   constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
     const userId = this.getUserObject().id; // Replace with the actual user ID
     this.getUser(userId);
    console.log("hi");
    this.userService.getUser(userId).subscribe((user: user)=>{
    this.user = user;
    this.editedLocation = user.location;
    this.editedBio = user.bio;
    this.editedFB = user.facebook;
    this.editedGH = user.github;
    this.editedLI = user.linkedin;
    this.editedIG = user.instagram;


    //this.editedPicture = user.profilePhoto;
      this.editedSurname = user.surname;
    });

    this.userPic = this.getUsersProfilePicture();
  }

  toggleEditing(field: string) {

    // const inputValue = event.target.textContent.trim();
    // this.isDirty = (inputValue !== this.editedName);
    if (field === 'location') {
      this.editingLocation = !this.editingLocation;
      this.isDirty = this.editingLocation; // Set isDirty to true only if editingName is true

      if (!this.editingLocation) {
        this.saveChanges();
      }
    }
    else if(field ==='profilePicture'){
      this.editingPicture = !this.editingPicture;
      this.isDirty = this.editingPicture;
    }
    else if(field ==='bio'){
      this.editingBio = !this.editingBio;
      this.isDirty = this.editingBio;
    }
    else if(field === 'fb'){
      this.editingFB = !this.editingFB;
      this.isDirty = this.editingFB;
    }
    else if(field === 'gh-link'){
      this.editingGH = !this.editingGH;
      this.isDirty = this.editingGH;
    }
    else if(field === 'ig-link'){
      this.editingIG = !this.editingIG;
      this.isDirty = !this.editingIG;
    }
    else if(field === 'li-link'){
      this.editingLI = !this.editingLI;
      this.isDirty = !this.editingLI;
    }
  }

  saveChanges(){
    this.user.location = this.editedLocation;
    this.user.surname = this.editedSurname;
    this.user.bio = this.editedBio;
    this.user.facebook = this.editedFB;
    this.user.linkedin = this.editedLI;
    this.user.github = this.editedGH;
    this.user.instagram = this.editedIG;

    //this.user.profilePhoto = this.editedPicture;

    this.userService.updateProfileLocation(this.user.location,this.user.emailAddress).subscribe(()=>{
      this.editedLocation = this.user.location;
      this.isDirty = false;
    });
   
    if(this.profilePicture){
      this.userService.updateUserProfilePicture(this.profilePicture, this.user.emailAddress).subscribe((response: object) => {
        console.log('service response: ', response);
      }, (error: any) => {
        console.log('Error uploading profile photo', error);
      });
    }
    this.userService.updateUserProfileBio(this.user.bio,this.user.emailAddress).subscribe(()=>{
      this.editedBio = this.user.bio;
      this.isDirty = false;
    });
    this.userService.updateProfileFB(this.user.facebook,this.user.emailAddress).subscribe(()=>{
      this.editedFB = this.user.facebook;
      this.isDirty = false;
    });
    this.userService.updateProfileIG(this.user.instagram,this.user.emailAddress).subscribe(()=>{
      this.editedIG = this.user.instagram;
      this.isDirty = false;
    });
    this.userService.updateProfileGH(this.user.github,this.user.emailAddress).subscribe(()=>{
      this.editedGH = this.user.github;
      this.isDirty = false;
    });
    this.userService.updateProfileLI(this.user.linkedin,this.user.emailAddress).subscribe(()=>{
      this.editedLI = this.user.linkedin;
      this.isDirty = false;
    });

  }

  // onFileChange(event: any) {
  //   const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
  //   this.profilePicture = file as File;
  // }

  getUser(userId: string) {

    this.userService.getUser(userId).subscribe(
      (user: user) => {
        this.user = user;
        //console.log(this.user);
        this.editedLocation = user.location;
        this.firstTimeLocation = user.location;
        this.editedSurname = user.surname;
        this.firstTimeSurname = user.surname;
        this.editedFB = user.facebook;
        this.editedGH = user.github;
        this.editedLI = user.linkedin;
        this.editedIG = user.instagram;
        this.editedBio = user.bio;
      },

      (error: any) => {
        console.error(error);
      }
    );

  }

  checkDirtyState() {
    // Check if any changes have been made
    this.isDirty = this.user.location !== this.editedLocation ||  this.user.surname !== this.editedSurname ;
  }

  onFieldChange() {
    this.isDirty = true;
  }

  // onSurnameChange(event: any) {
  //   const span = event.target;
  //   const inputValue = event.target.textContent.trim();
  //   this.editedSurname = inputValue;
  //   this.isDirty = true;

  //   const selection = window.getSelection();
  //   const range = document.createRange();
  //   range.selectNodeContents(span);
  //   range.collapse(false);
  //   selection?.removeAllRanges();
  //   selection?.addRange(range);
  // }

  onFileChanged(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.profilePicture = inputElement.files[0];
      // Call your function or perform any desired actions with the selected file
    }
    this.isDirty = true;
  }

  getUserName(){
    const user = this.authService.getUser();
    return this.user.name;
  }
  
  getUserSurname(){
   const user = this.authService.getUser();
   return this.user.surname;
  }
  
  getUserEmail(){
    const user = this.authService.getUser();
    return this.user.emailAddress;
  }
  
  getUsersProfilePicture(){
    const user = this.authService.getUser();
    console.log("userrr", user);
    console.log("profile photo: " + user.profilePhoto);
    return this.user.profilePhoto;
  }

  getUsersBackgroundPicture(){
    const user = this.authService.getUser();
    return this.user.backgroundPhoto;
  }

  getUsersRole()
  {
    const user = this.authService.getUser();
    return this.user.roles;
  }
  
  getUsersGH(){
    const user = this.authService.getUser();
    return this.user.github;
  }

  getUsersFB(){
     const user = this.authService.getUser();
    return this.user.facebook;
  }

  getUsersIG(){
    const user = this.authService.getUser();
   return this.user.instagram;
 }

 getUsersLI(){
  const user = this.authService.getUser();
 return this.user.linkedin;
}

  getUserObject(){
    return this.authService.getUser();
  }
//   updateUser() {
//     const userId = '123'; // Replace with the actual user ID
//     const userData: FormData = new FormData();
//     // Set the updated user data in the FormData object
//     userData.append('name', 'John Doe');
//     userData.append('surname','Example');
//     userData.append('email', 'john@example.com');
//     // Add more fields as needed

//     this.userService.updateProfileName(userId, userData).subscribe(
//       (updatedUser: User) => {
//         this.user = updatedUser;
//       },
//       (error: any) => {
//         console.error(error);
//       }
//     );
// }

//   onProfilePictureChange(event: any) {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       this.user.profilePhoto = files[0];
//     }
//   }

//   updateProfilePicture() {
//     if (!this.user.profilePhoto) {
//       return;
//     }

//     const userId = '123'; // Replace with the actual user ID

//     this.userService.updateUserProfilePicture(userId, this.profilePicture).subscribe(
//       (updatedUser: User) => {
//         this.user = updatedUser;
//         // Reset the profilePicture variable
//         this.profilePicture = null;
//       },
//       (error: any) => {
//         console.error(error);
//       }
//     );
// }
}
