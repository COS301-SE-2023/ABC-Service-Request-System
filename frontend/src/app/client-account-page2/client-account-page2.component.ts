import { Component, Output, EventEmitter, OnInit, Input} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-account-page2',
  templateUrl: './client-account-page2.component.html',
  styleUrls: ['./client-account-page2.component.scss']
})
export class ClientAccountPage2Component implements OnInit{
  @Output() backClicked = new EventEmitter<number>();
  @Output() continueClicked = new EventEmitter<void>();

  @Output() formSubmitted: EventEmitter<any> = new EventEmitter<any>();

  @Input() selectedOrganisation!: string;

  createUserForm: FormGroup;
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder) {
    this.createUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      organisation: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      industry: ['', Validators.required],
    });
  }

  ngOnInit(): void {
      console.log(this.selectedOrganisation, ' lol');

    if(this.selectedOrganisation !== undefined){
      this.createUserForm.get('organisation')?.disable();
      this.createUserForm.get('organisation')?.setValue(this.selectedOrganisation);
    }
  }



  // async onSubmit() {
  //   alert('lol');
  //   console.log('Form submitted!');
  //   console.log('Form value:', this.createUserForm.value);

  //   if (!this.createUserForm.valid) {
  //     console.log('Form is not valid');
  //     return;
  //   }

  //   const formData = this.createUserForm.value;

  //   try {
  //     console.log('Creating user:', formData);
  //   } catch (error) {
  //     console.error('Error creating user:', error);
  //     this.errorMessage = 'Error creating user. Please try again.';
  //   }
  // }

  onBackClicked(): void{
    if(this.selectedOrganisation !== undefined)
      this.backClicked.emit(5);
    else
      this.backClicked.emit(0);
  }

  onContinueClicked(): void{
    this.createUserForm.get('organisation')?.enable();

    console.log('Form submitted!');
    console.log('Form value:', this.createUserForm.value);
    if (!this.createUserForm.valid) {
      console.log('Form is not valid');
      return;
    }

    const formData = this.createUserForm.value;

    try {
      console.log('Creating user:', formData);
      this.formSubmitted.emit(formData); // Emit the form values
    } catch (error) {
      console.error('Error creating user:', error);
      this.errorMessage = 'Error creating user. Please try again.';
    }

    this.continueClicked.emit();
  }
}
