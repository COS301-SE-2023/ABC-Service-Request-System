// import { TestBed, ComponentFixture } from '@angular/core/testing';
// import { DashPanelComponent } from './dash-panel.component';
// import { AuthService } from 'src/services/auth.service';
// import { of } from 'rxjs';
// import { RouterTestingModule } from '@angular/router/testing';
// import { Router } from '@angular/router';

// describe('DashPanelComponent', () => {
//   let component: DashPanelComponent;
//   let fixture: ComponentFixture<DashPanelComponent>;
//   let authService: Partial<AuthService> | any;
//   let router: Router;

//   beforeEach(async () => {
//     authService = {
//       isManager: () => true,
//       isAdmin: () => false, // Add this line to mock the isAdmin method
//     };

//     await TestBed.configureTestingModule({
//       declarations: [DashPanelComponent],
//       imports: [RouterTestingModule],
//       providers: [ { provide: AuthService, useValue: authService } ],
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(DashPanelComponent);
//     component = fixture.componentInstance;
//     router = TestBed.inject(Router);
//     fixture.detectChanges();
//   });

//   it('should create the DashPanelComponent', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should emit openForm event if user is a manager', () => {
//     spyOn(component.openForm, 'emit'); // Create a spy for the EventEmitter
//     //spyOn(authService, 'isManager').and.returnValue(true); // Assume the user is a manager

//     component.openNewTicketForm();

//     expect(component.openForm.emit).toHaveBeenCalled(); // Verify that the emit method was called
//   });

//   it('should not emit openForm event if user is not a manager', () => {
//     spyOn(component.openForm, 'emit');
//     spyOn(authService, 'isManager').and.returnValue(false); // Assume the user is not a manager

//     component.openNewTicketForm();

//     expect(component.openForm.emit).not.toHaveBeenCalled(); // Verify that the emit method was not called
//   });

//   it('should navigate to /create-account when openCreateAccount is called', () => {
//     spyOn(router, 'navigate');

//     component.openCreateAccount();

//     expect(router.navigate).toHaveBeenCalledWith(['/create-account']);
//   });
// });
