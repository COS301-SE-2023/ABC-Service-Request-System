import { Component, OnInit} from '@angular/core';
import { UserService } from 'src/services/user.service';
import { user } from '../../../../backend/src/models/user.model';
@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.scss']
})
export class SettingsProfileComponent implements OnInit{
  user!: user;
  profilePicture!: File;
  editedName!: string;
  firstTimeName!: string;
  firstTimeSurname!:string;
  editedSurname!: string;
  editedPicture!: File;
  editingName = false;
  editingPicture= false;
  editingSurname = false;
  isDirty = false;
  //file: File | null = null;

   constructor(private userService: UserService) {}

  ngOnInit() {
     const userId = '649877e514fc566f585c9330'; // Replace with the actual user ID
     this.getUser(userId);
    console.log("hi");
    this.userService.getUser(userId).subscribe((user: user)=>{
    this.user = user;
    this.editedName = user.name;
    //this.editedPicture = user.profilePhoto;
    this.editedSurname = user.surname;
    });
  }

  toggleEditing(field: string) {

    // const inputValue = event.target.textContent.trim();
    // this.isDirty = (inputValue !== this.editedName);
    if (field === 'name') {
      this.editingName = !this.editingName;
      this.isDirty = this.editingName; // Set isDirty to true only if editingName is true

      if (!this.editingName) {
        this.saveChanges();
      }
    } else if (field === 'surname') {
      this.editingSurname = !this.editingSurname;
      this.isDirty = this.editingSurname; // Set isDirty to true only if editingSurname is true
    }
    else if(field ==='profilePicture'){
      this.editingPicture = !this.editingPicture;
      this.isDirty = this.editingPicture;
    }
  }

  saveChanges(){
    this.user.name = this.editedName;
    this.user.surname = this.editedSurname;
    //this.user.profilePhoto = this.editedPicture;

    this.userService.updateProfileName(this.user.name,this.user.emailAddress).subscribe(()=>{
      this.editedName = this.user.name;
      this.isDirty = false;
    });
    this.userService.updateProfileSurname(this.user.surname,this.user.emailAddress).subscribe(()=>{
      this.editedSurname = this.user.surname;
      this.isDirty = false;
    });
    this.userService.updateUserProfilePicture(this.profilePicture,this.user.emailAddress).subscribe(()=>{
      this.editedPicture = this.profilePicture;
      this.isDirty = false;
    })

  }

  url = "./assets/App Logo.jpg";

  onFileChange(event: any) {
    const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
    this.profilePicture = file as File;
  }

  getUser(userId: string) {

    this.userService.getUser(userId).subscribe(
      (user: user) => {
        this.user = user;
        //console.log(this.user);
        this.editedName = user.name;
        this.firstTimeName = user.name;
        this.editedSurname = user.surname;
        this.firstTimeSurname = user.surname;
      },

      (error: any) => {
        console.error(error);
      }
    );

  }

  checkDirtyState() {
    // Check if any changes have been made
    this.isDirty = this.user.name !== this.editedName ||  this.user.surname !== this.editedSurname;
  }

  onNameChange(event: any) {
      const span = event.target;
      const inputValue = event.target.textContent.trim();
      this.editedName = inputValue;
      this.isDirty = true;

      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(span);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }

    onSurnameChange(event: any) {
      const span = event.target;
      const inputValue = event.target.textContent.trim();
      this.editedSurname = inputValue;
      this.isDirty = true;

      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(span);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
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
