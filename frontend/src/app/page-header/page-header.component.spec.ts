import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PageHeaderComponent } from './page-header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { tickets } from '../data';
import { Ticket } from '../app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageHeaderComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, MatIconModule, MatBadgeModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the page header component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties correctly', () => {
    expect(component.tickets).toEqual(tickets);
    expect(component.searchTerm).toEqual('');
    expect(component.filteredTickets).toEqual(tickets);
    expect(component.showForm).toBeFalse();
  });

  it('should emit openForm event when openNewTicketForm is called', () => {
    spyOn(component.openForm, 'emit');

    component.openNewTicketForm();

    expect(component.openForm.emit).toHaveBeenCalled();
  });

  it('should add a new ticket correctly when addNewTicket is called', () => {
    component.tickets = [];

    const newTicket: Ticket = {
      id: 1,
      title: 'New Ticket',
      assignee: 'John Doe',
      reviewer: 'Jane Smith',
      company: 'ABC Corp',
      priority: 'High',
      startDate: '2023-06-25',
      endDate: '2023-06-30',
      status: 'Open',
      comments: []
    };

    component.addNewTicket(newTicket);

    expect(component.tickets).toEqual([newTicket]);
    expect(component.showForm).toBeFalse();
  });


  it('should add a new ticket correctly when addNewTicket is called', () => {
    component.tickets = [];

    const newTicket: Ticket = {
      id: 1,
      title: 'New Ticket',
      assignee: '',
      reviewer: '',
      company: '',
      priority: '',
      startDate: '',
      endDate: '',
      status: '',
      comments: []
    };

    component.addNewTicket(newTicket);

    expect(component.tickets).toEqual([newTicket]);
    expect(component.showForm).toBeFalse();
  });


  it('should set showForm to false when closeForm is called', () => {
    component.showForm = true;

    component.closeForm();

    expect(component.showForm).toBeFalse();
  });
});
