import { Component, OnInit } from '@angular/core';
import { client, project, request } from '../../../../backend/clients/src/models/client.model';
import { AuthService } from 'src/services/auth.service';
import { Observable } from 'rxjs';
// import { v4 as uuidv4} from 'uuid';
import { Router } from '@angular/router';
import { ClientService } from 'src/services/client.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { response } from 'express';
import { ticket } from '../../../../backend/clients/src/models/ticket.model';
import { TicketsService } from 'src/services/ticket.service';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  loggedInClient$!: Observable<client>;

  selectedProject!: project;

  loggedInClientObject!: client;
  //panel expansions
  isProjectExpanded = false;
  isRequestExpanded = false;
  isViewRequestExpanded = false;
  isViewTicketsExpanded = false;

  requestsMade: request[] = [];

  projectSelectedError = false;
  summaryError = false;
  descriptionError = false;
  priorityError = false;

  constructor(private authService: AuthService, private router: Router, private clientService: ClientService, private snackBar: MatSnackBar, private ticketService: TicketsService) {
    if (!this.loggedInClientObject)
      this.getClient();
  }

  getClient() {
    this.loggedInClient$ = this.authService.getLoggedInClient();

    this.loggedInClient$.subscribe((loggedInClient) => {
      this.loggedInClientObject = loggedInClient;

      this.clientService.getClientById(loggedInClient.id).subscribe(
        (res) => {
          this.loggedInClientObject = res;
          console.log(this.loggedInClientObject);
          this.getClientRequests();
        },
        (err) => {
          console.log('an error occured when trying to get client', err);
        }
      )
    });
  }

  ngOnInit(): void {
    if(!localStorage.getItem('loggedInClient'))
      this.getClient();
    else
      this.loggedInClientObject = JSON.parse(localStorage.getItem('loggedInClient')!);
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
          this.toggleProjectExpansion();
          form.resetForm();
          this.openSnackBar("Request Sent", "OK");
          this.getClient();
        },
        (err) => {
          console.log("recieved error:", err);
        }
      );
    }
  }

  submitRequestForm(form: any) {
    if(form.valid) {
      form.value.description = form.value.description.replace(/<\/?p>/g, '');
      console.log('Form submitted!', form.value);

      const selectedPriority = form.value.priority;
      const currentDate = new Date();
      const selectedProject = this.selectedProject;
      const lowPriorityTime = this.selectedProject.lowPriorityTime;
      const mediumPriorityTime = this.selectedProject.mediumPriorityTime;
      const highPriorityTime = this.selectedProject.highPriorityTime;

      let numericValue = parseInt(lowPriorityTime);
      let unit = lowPriorityTime.charAt(lowPriorityTime.length - 1);
      if (selectedPriority.toLowerCase() == 'low') {
        numericValue = parseInt(lowPriorityTime);
        unit = lowPriorityTime.charAt(lowPriorityTime.length - 1);
      } else if (selectedPriority.toLowerCase() == 'medium') {
        numericValue = parseInt(mediumPriorityTime);
        unit = mediumPriorityTime.charAt(mediumPriorityTime.length - 1);
      } else if (selectedPriority.toLowerCase() == 'high') {
        numericValue = parseInt(highPriorityTime);
        unit = highPriorityTime.charAt(highPriorityTime.length - 1);
      }

      const endDate = new Date(currentDate);
      if (selectedPriority.toLowerCase() === 'low') {
        if (unit === 'h') {
          endDate.setHours(currentDate.getHours() + numericValue);
        } else if (unit === 'd') {
          endDate.setDate(currentDate.getDate() + numericValue);
        } else if (unit === 'w') {
          endDate.setDate(currentDate.getDate() + numericValue * 7);
        }
      } else if (selectedPriority.toLowerCase() === 'medium') {
        if (unit === 'h') {
          endDate.setHours(currentDate.getHours() + numericValue);
        } else if (unit === 'd') {
          endDate.setDate(currentDate.getDate() + numericValue);
        } else if (unit === 'w') {
          endDate.setDate(currentDate.getDate() + numericValue * 7);
        }
      } else if (selectedPriority.toLowerCase() === 'high') {
        if (unit === 'h') {
          endDate.setHours(currentDate.getHours() + numericValue);
        } else if (unit === 'd') {
          endDate.setDate(currentDate.getDate() + numericValue);
        } else if (unit === 'w') {
          endDate.setDate(currentDate.getDate() + numericValue * 7);
        }
      }
      const endDateString = endDate.toLocaleDateString();
      console.log('selected priority:' + selectedPriority);
      console.log(lowPriorityTime);
      console.log(mediumPriorityTime);
      console.log(highPriorityTime);
      console.log('azure');
      console.log(endDateString);

      this.clientService.addTicketRequest(form.value.projectSelected.name, form.value.summary, form.value.description, form.value.priority, this.loggedInClientObject.id, this.selectedProject.id, endDateString).subscribe(
        (response) => {
          console.log("recieved client response", response);
          this.toggleRequestExpansion();
          form.resetForm();
          this.openSnackBar("Request Sent", "OK");
          this.getClient();
        },
        (err) => {
          console.log("received error: ", err);
        }
      )
    } else {
      if(form.value.projectSelected == ""){
        this.projectSelectedError = true;
      }

      if(form.value.summary == ""){
        this.summaryError = true;
      }

      if(form.value.description == ""){
        this.descriptionError = true;
      }

      if(form.value.priority == ""){
        this.priorityError = true;
      }
    }
  }

  inputChanged(componentType: string) {
    switch (componentType) {
      case 'project':
        this.projectSelectedError = false;
        break;
      case 'summary':
        this.summaryError = false;
        break;
      case 'description':
        this.descriptionError = false;
        break;
      case 'priority':
        this.priorityError = false;
        break;
      default:
        break;
    }
  }

  getClientRequests() {
    if(this.loggedInClientObject){
      if(this.loggedInClientObject.requests && this.loggedInClientObject.requests !== undefined && this.loggedInClientObject.requests.length > 0) {
        this.requestsMade = this.loggedInClientObject.requests;
      }
    }
  }

  //expansions
  toggleProjectExpansion() {
    this.isProjectExpanded = !this.isProjectExpanded;
  }

  toggleRequestExpansion() {
    this.isRequestExpanded = !this.isRequestExpanded;
  }

  toggleViewRequestExpansion() {
    this.isViewRequestExpanded = !this.isViewRequestExpanded;
  }

  toggleViewTicketsExpansion() {
    this.isViewTicketsExpanded = !this.isViewTicketsExpanded;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  convertToDate(id: string){
    const timestamp = new Date(parseInt(id));
    const day = timestamp.getDate().toString().padStart(2, '0');
    const month = (timestamp.getMonth() + 1).toString().padStart(2, '0');
    const year = timestamp.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }

}
