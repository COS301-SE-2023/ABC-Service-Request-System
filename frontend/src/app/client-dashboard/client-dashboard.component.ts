import { Component, OnInit } from '@angular/core';
import { client } from '../../../../backend/clients/src/models/client.model';
import { AuthService } from 'src/services/auth.service';
import { Observable } from 'rxjs';
// import { v4 as uuidv4} from 'uuid';
import { Router } from '@angular/router';
import { ClientService } from 'src/services/client.service';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  loggedInClient$!: Observable<client>;

  loggedInClientObject!: client;
  //panel expansions
  isProjectExpanded = false;
  isRequestExpanded = false;


  constructor(private authService: AuthService, private router: Router, private clientService: ClientService) {
    this.loggedInClient$ = this.authService.getLoggedInClient();

    this.loggedInClient$.subscribe((loggedInClient) => {
      this.loggedInClientObject = loggedInClient;
      console.log(this.loggedInClientObject);
    });
  }

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

      this.clientService.addProjectRequest(form.value.projectName, form.value.additionalProjectInfo, this.loggedInClientObject.id).subscribe(
        (response) => {
          console.log("recieved client response: ", response);
        },
        (err) => {
          console.log("recieved error:", err);
        }
      );
    }
  }

  //expansions
  toggleProjectExpansion() {
    this.isProjectExpanded = !this.isProjectExpanded;
  }

  toggleRequestExpansion() {
    this.isRequestExpanded = !this.isRequestExpanded;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

}
