import { Component, OnInit} from '@angular/core';
import { UserService } from 'src/services/user.service';
import { user } from '../../../../backend/src/models/user.model';
import { AuthService } from 'src/services/auth.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
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
  backgroundPicture!: File;
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
   this.RenderChart();
   this.userService.getUser(userId).subscribe((user: user)=>{
   this.user = user;
   });

   this.userPic = this.getUsersProfilePicture();
 }

 getUsersProfilePicture(){
  const user = this.authService.getUser();
  console.log("userrr", user);
  console.log("profile photo: " + user.profilePhoto);
  return this.user.profilePhoto;
}

getUsersBackgroundPicture(){
  // const user = this.authService.getUser();
  // console.log("userrr", user);
  // console.log("background photo: " + user.backgroundPhoto);
  // return this.user.BackgroundPhoto;
}

getUsersBio(){
  // const user = this.authService.getUser();
  // console.log("userrr", user);
  // console.log("bio: " + user.bio);
  // return this.user.bio;
}

getUserObject(){
  return this.authService.getUser();
}



RenderChart() {
  const myChart = new Chart("piechart", {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'April', 'May'],
      datasets: [{
        label: '# of tickets completed',
        data: [12, 10, 17, 20, 5],
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Optional: Add a background color to the bars
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

}
}
