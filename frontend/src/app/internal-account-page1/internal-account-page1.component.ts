import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-internal-account-page1',
  templateUrl: './internal-account-page1.component.html',
  styleUrls: ['./internal-account-page1.component.scss']
})
export class InternalAccountPage1Component implements OnInit{
  @Output() completeClicked = new EventEmitter<void>();

  createUserForm: FormGroup;
  errorMessage!: string;
  groupControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;
  isAddGroupOverlayOpened = false;

  constructor(public authService: AuthService, private formBuilder: FormBuilder, private router: Router) {
    this.createUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      profilePhoto: [''],
      email: ['', [Validators.required, Validators.email]],
      roles: ['', Validators.required],
      groups: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.filteredOptions = this.groupControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
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
        window.alert('User created successfully');
        this.router.navigate(['/dashboard']);
      } else {
        console.error('Error creating user:', response);
        this.errorMessage = 'Error creating user. Please try again.';
      }
    } catch (error) {
      console.error('Error creating user:', error);
      this.errorMessage = 'Error creating user. Please try again.';
    }
  }

  removeGroupTab(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const groupTabElement = targetElement.closest('.group-tab');
    if (groupTabElement) {
      groupTabElement.remove();
    }
  }

  handleKeyupEvent(event: KeyboardEvent): void {
    console.log("nothing");
  }

  onCompleteClicked(): void{
    this.completeClicked.emit();
  }

  //Overlays
  toggleAddGroupOverlay(){
    console.log(this.isAddGroupOverlayOpened);
    this.isAddGroupOverlayOpened = !this.isAddGroupOverlayOpened;
  }
}

