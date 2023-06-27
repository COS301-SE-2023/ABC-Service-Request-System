// import { TestBed, ComponentFixture } from '@angular/core/testing';
// import { NewTicketFormComponent } from './new-ticket-form.component';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';
// import { Router } from '@angular/router';
// import { TicketsService } from 'src/services/ticket.service';
// import { of } from 'rxjs';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { DashPanelComponent } from '../dash-panel/dash-panel.component';

// describe('NewTicketFormComponent', () => {
//   let component: NewTicketFormComponent;
//   let fixture: ComponentFixture<NewTicketFormComponent>;
//   let formBuilder: FormBuilder;
//   let ticketService: Partial<TicketsService> | any; // Specify the type as Partial<TicketsService> | any
//   let router: Router;

//   beforeEach(async () => {
//     ticketService = {
//       addTicket: () => of({}) // Mock the addTicket method
//     };

//     await TestBed.configureTestingModule({
//       declarations: [NewTicketFormComponent],
//       imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
//       providers: [
//         FormBuilder,
//         { provide: TicketsService, useValue: ticketService },
//       ],
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(NewTicketFormComponent);
//     component = fixture.componentInstance;
//     formBuilder = TestBed.inject(FormBuilder);
//     router = TestBed.inject(Router);
//     fixture.detectChanges();
//   });

//   it('should create the NewTicketFormComponent', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize the ticketForm correctly', () => {
//     expect(component.ticketForm.get('summary')).toBeTruthy();
//     expect(component.ticketForm.get('assignee')).toBeTruthy();
//     expect(component.ticketForm.get('assigned')).toBeTruthy();
//     expect(component.ticketForm.get('group')).toBeTruthy();
//     expect(component.ticketForm.get('priority')).toBeTruthy();
//     expect(component.ticketForm.get('startDate')).toBeTruthy();
//     expect(component.ticketForm.get('endDate')).toBeTruthy();
//     expect(component.ticketForm.get('status')).toBeTruthy();
//   });

//   // it('should call addTicket method when the form is valid', () => {
//   //   spyOn(ticketService, 'addTicket');

//   //   component.ticketForm.patchValue({
//   //     summary: 'Test summary',
//   //     assignee: 'Test assignee',
//   //     assigned: 'Test assigned',
//   //     group: 'Test group',
//   //     priority: 'Test priority',
//   //     startDate: 'Test start date',
//   //     endDate: 'Test end date',
//   //     status: 'Test status',
//   //   });

//   //   component.onSubmit();

//   //   expect(ticketService.addTicket).toHaveBeenCalledWith(
//   //     'Test summary',
//   //     'Test assignee',
//   //     'Test assigned',
//   //     'Test group',
//   //     'Test priority',
//   //     'Test start date',
//   //     'Test end date',
//   //     'Test status'
//   //   );
//   // });

//   // it('should emit newTicketEvent with the new ticket data', () => {
//   //   spyOn(component.newTicketEvent, 'emit');

//   //   component.ticketForm.setValue({
//   //     summary: 'Test summary',
//   //     assignee: 'Test assignee',
//   //     assigned: 'Test assigned',
//   //     group: 'Test group',
//   //     priority: 'Test priority',
//   //     startDate: 'Test start date',
//   //     endDate: 'Test end date',
//   //     status: 'Test status',
//   //   });

//   //   component.onSubmit();

//   //   expect(component.newTicketEvent.emit).toHaveBeenCalledWith({
//   //     id: 'test',
//   //     summary: 'Test summary',
//   //     assignee: 'Test assignee',
//   //     assigned: 'Test assigned',
//   //     group: 'Test group',
//   //     priority: 'Test priority',
//   //     startDate: 'Test start date',
//   //     endDate: 'Test end date',
//   //     status: 'Test status',
//   //   });
//   // });

//   // it('should navigate to the ticket after submission', () => {
//   //   spyOn(router, 'navigate');

//   //   component.ticketForm.setValue({
//   //     summary: 'Test summary',
//   //     assignee: 'Test assignee',
//   //     assigned: 'Test assigned',
//   //     group: 'Test group',
//   //     priority: 'Test priority',
//   //     startDate: 'Test start date',
//   //     endDate: 'Test end date',
//   //     status: 'Test status',
//   //   });

//   //   component.onSubmit();

//   //   expect(router.navigate).toHaveBeenCalledWith(['/ticket/${id}']);
//   // });

//   // it('should log an error message when the form is invalid', () => {
//   //   spyOn(console, 'log');

//   //   component.ticketForm.setValue({
//   //     summary: 'Test summary',
//   //     assignee: '',
//   //     assigned: '',
//   //     group: '',
//   //     priority: '',
//   //     startDate: '',
//   //     endDate: '',
//   //     status: '',
//   //   });

//   //   component.onSubmit();

//   //   expect(console.log).toHaveBeenCalledWith(
//   //     'Form is invalid. Please fill in all required fields.'
//   //   );
//   // });
// });
