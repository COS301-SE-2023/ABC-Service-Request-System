// import { TestBed, ComponentFixture } from '@angular/core/testing';
// import { CreateAccountComponent } from './create-account.component';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { Router } from '@angular/router';
// import { AuthService } from 'src/services/auth.service';
// import { of, throwError } from 'rxjs';
// import { DashPanelComponent } from '../dash-panel/dash-panel.component';

// describe('CreateAccountComponent', () => {
//   let component: CreateAccountComponent;
//   let fixture: ComponentFixture<CreateAccountComponent>;
//   let fb: FormBuilder;
//   let authService: Partial<AuthService> | any; // Specify the type as Partial<AuthService> | any
//   let router: Router;

//   beforeEach(async () => {
//     authService = {
//       createUser: () => of({ message: 'User created successfully' }),
//       isAdmin: () => true,
//     };

//     await TestBed.configureTestingModule({
//       declarations: [CreateAccountComponent],
//       imports: [HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule, DashPanelComponent],
//       providers: [FormBuilder, { provide: AuthService, useValue: authService }],
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(CreateAccountComponent);
//     component = fixture.componentInstance;
//     fb = TestBed.inject(FormBuilder);
//     router = TestBed.inject(Router); // Get the Router instance
//     fixture.detectChanges();
//   });

//   it('should create the create account component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should create an account', () => {
//     expect(component.createUserForm.contains('name')).toBe(true);
//     expect(component.createUserForm.contains('surname')).toBe(true);
//     expect(component.createUserForm.contains('profilePhoto')).toBe(true);
//     expect(component.createUserForm.contains('emailAddress')).toBe(true);
//     expect(component.createUserForm.contains('roles')).toBe(true);
//     expect(component.createUserForm.contains('groups')).toBe(true);
//   });

//   it('should navigate to dashboard after successful user creation', async () => {
//     spyOn(authService, 'createUser').and.returnValue(of({ message: 'User created successfully' }));
//     spyOn(router, 'navigate'); // Create a spy object for router.navigate

//     // Set form values before submitting
//     component.createUserForm.setValue({
//       name: 'Test',
//       surname: 'User',
//       profilePhoto: 'image.jpg',
//       emailAddress: 'test.user@example.com',
//       roles: 'User',
//       groups: 'Group1'
//     });

//     await component.onSubmit();

//     expect(authService.createUser).toHaveBeenCalledWith(component.createUserForm.value);
//     expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
//   });

//   it('should navigate to dashboard when navigateToDashboard is called', () => {
//     spyOn(router, 'navigate'); // Create a spy object for router.navigate

//     component.navigateToDashboard(); // Call the function

//     expect(router.navigate).toHaveBeenCalledWith(['/dashboard']); // Verify that router.navigate was called with correct parameter
//   });

//   it('should return when the form is invalid', async () => {
//     spyOn(authService, 'createUser');
//     spyOn(router, 'navigate');

//     // Set form values to be invalid
//     component.createUserForm.setValue({
//       name: '', // required field
//       surname: '', // required field
//       profilePhoto: '',
//       emailAddress: '', // required field
//       roles: '', // required field
//       groups: '' // required field
//     });

//     await component.onSubmit();

//     expect(authService.createUser).not.toHaveBeenCalled();
//     expect(router.navigate).not.toHaveBeenCalled();
//   });

//   it('should navigate to the dashboard when the user is created successfully', async () => {
//     spyOn(authService, 'createUser').and.returnValue(of({ message: 'User created successfully' }));
//     spyOn(router, 'navigate');

//     // Set form values to be valid
//     component.createUserForm.setValue({
//       name: 'Test',
//       surname: 'User',
//       profilePhoto: 'image.jpg',
//       emailAddress: 'test.user@example.com',
//       roles: 'User',
//       groups: 'Group1'
//     });

//     await component.onSubmit();

//     expect(authService.createUser).toHaveBeenCalledWith(component.createUserForm.value);
//     expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
//   });

//   it('should handle error when there is an error in creating the user', async () => {
//     const errorResponse = new ErrorEvent('Network error', {
//       error: new Error('Failed to create user'),
//     });

//     spyOn(authService, 'createUser').and.returnValue(throwError(errorResponse));
//     spyOn(router, 'navigate');

//     // Set form values to be valid
//     component.createUserForm.setValue({
//       name: 'Test',
//       surname: 'User',
//       profilePhoto: 'image.jpg',
//       emailAddress: 'test.user@example.com',
//       roles: 'User',
//       groups: 'Group1'
//     });

//     await component.onSubmit();

//     expect(authService.createUser).toHaveBeenCalledWith(component.createUserForm.value);
//     expect(router.navigate).not.toHaveBeenCalled();
//     expect(component.errorMessage).toEqual('Error creating user. Please try again.');
//   });


// });
