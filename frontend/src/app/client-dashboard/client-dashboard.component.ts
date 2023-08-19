import { Component, OnInit } from '@angular/core';
import { client } from '../../../../backend/clients/src/models/client.model';
import { AuthService } from 'src/services/auth.service';
import { Observable } from 'rxjs';
// import { v4 as uuidv4} from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  loggedInClient$!: Observable<client>;

  //panel expansions
  isProjectExpanded = false;
  isRequestExpanded = false;


  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loggedInClient$ = this.authService.getLoggedInClient();
  }

  createRoom(){
    console.log("create room");
    // const uuid = uuidv4();
    this.router.navigate([`/room/${Date.now()}`]);
  }

  submitProjectForm(form: any) {
    if (form.valid) {
      console.log('Form submitted!', form.value);
    }
  }

  //expansions
  toggleProjectExpansion() {
    this.isProjectExpanded = !this.isProjectExpanded;
  }

  toggleRequestExpansion() {
    this.isRequestExpanded = !this.isRequestExpanded;
  }

}
