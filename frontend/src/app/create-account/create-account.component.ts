import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tickets } from '../data';
import { Ticket } from '../app.component';
import { NavbarService } from 'src/services/navbar.service';


@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit{

  tickets = tickets; // declare tickets
  showForm = false; // To control the ticket form visibility
  createUserForm: FormGroup;
  errorMessage!: string; // Add definite assignment assertion (!)
  navbarIsCollapsed!: boolean;
  selected = 'client';

  clientStage = 0;

  constructor(
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    public navbarService: NavbarService
  ) {
    this.createUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      profilePhoto: [''],
      emailAddress: ['', [Validators.required, Validators.email]],
      roles: ['', Validators.required],
      groups: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
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

  async onSubmit() {
    console.log('Form submitted!');
    console.log('Form value:', this.createUserForm.value);

    if (!this.createUserForm.valid) {
      console.log('Form is not valid');
      return;
    }

    const formData = this.createUserForm.value;

    try {
      console.log('Creating user:', formData);
      const response: any = await this.authService.createUser(formData).toPromise();
      console.log('User created successfully');

      if (response && response.message === 'User created successfully') {
        // User creation was successful
        window.alert('User created successfully'); // Alert the user
        this.router.navigate(['/dashboard']);
      } else {
        // Handle other response scenarios, such as conflicts or server errors
        console.error('Error creating user:', response);
        this.errorMessage = 'Error creating user. Please try again.';
      }
    } catch (error) {
      console.error('Error creating user:', error);
      this.errorMessage = 'Error creating user. Please try again.';
    }
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
}
