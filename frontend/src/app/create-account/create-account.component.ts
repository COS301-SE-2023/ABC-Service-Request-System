import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tickets } from '../data';
import { Ticket } from '../app.component';
import { NavbarService } from 'src/services/navbar.service';
import { client, project } from '../../../../backend/src/models/client.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit{

  tickets = tickets; // declare tickets
  showForm = false; // To control the ticket form visibility
  errorMessage!: string; // Add definite assignment assertion (!)
  navbarIsCollapsed!: boolean;
  selected = 'client';

  clientStage = 0;

  recievedFormData: any;
  recievedCreatedClient!: client;

  managingClient!: client;

  projectToEdit!: project;

  selectedOrganisation!: string;
  selectedOrganisationForProject!: string;

  constructor(
    public authService: AuthService,
    private router: Router,
    public navbarService: NavbarService,
    private route: ActivatedRoute
  ) {  }

  ngOnInit(): void {
    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
    });

    this.route.queryParams.subscribe(params => {
      this.selectedOrganisation = params['organisation'];
      this.selectedOrganisationForProject = params['project'];

      if (this.selectedOrganisation) {
        this.clientStage = 1;
      }

      if(this.selectedOrganisationForProject) {
        this.clientStage = 2;
      }
    });
  }

  openNewTicketForm() {
    // Open new ticket form
    this.showForm = true;
  }

  closeForm() {
    // Close new ticket form
    this.showForm = false;
  }

  onSelectionChange() {
    this.clientStage = 0;
  }

  navigateToCreateAccount() {
    this.router.navigate(['/create-account']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  incrementClientStage(){
    this.clientStage++;
  }

  decrementClientStage(){
    this.clientStage--;
  }

  incrementClientStageManage(){
    this.clientStage = 4;
  }

  decrementClientStageManage(){
    this.clientStage = 0;
  }

  incrementClientStageAndReceiveEmit(event: { selectedClient: client, projectToEdit: project}){
    //this.clientToEdit = event.selectedClient;
    this.projectToEdit = event.projectToEdit;
    this.clientStage++;
  }

  getFormValues(formData: any): void {
    console.log('Received form data: ', formData);
    this.recievedFormData = {
      ...formData,
      projectName: '',
      logo: '',
      color: '',
      groups: []
    }
  }

  getCreatedClient(client: client): void {
    this.recievedCreatedClient = client;
  }

  getSelectedClient(client: client): void {
    this.managingClient = client;
  }
}
