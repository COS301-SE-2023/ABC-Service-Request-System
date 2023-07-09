import { Component, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-client-account-page2',
  templateUrl: './client-account-page2.component.html',
  styleUrls: ['./client-account-page2.component.scss']
})
export class ClientAccountPage2Component {
  @Output() backClicked = new EventEmitter<void>();
  @Output() continueClicked = new EventEmitter<void>();

  createUserForm: FormGroup;
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder) {
    this.createUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      organisation: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      industry: ['', Validators.required]
    });
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
      // const response: any = await this.authService.createUser(formData).toPromise();
      // console.log('User created successfully');

      // if (response && response.message === 'User created successfully') {
      //   window.alert('User created successfully');
      //   this.router.navigate(['/dashboard']);
      // } else {
      //   console.error('Error creating user:', response);
      //   this.errorMessage = 'Error creating user. Please try again.';
      // }
    } catch (error) {
      console.error('Error creating user:', error);
      this.errorMessage = 'Error creating user. Please try again.';
    }
  }

  onBackClicked(): void{
    this.backClicked.emit();
  }

  onContinueClicked(): void{
    this.continueClicked.emit();
  }
}
