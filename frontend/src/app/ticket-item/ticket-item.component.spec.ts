import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TicketItemComponent } from './ticket-item.component';
import { ticket } from '../../../../backend/src/models/ticket.model';

describe('TicketItemComponent', () => {
  let component: TicketItemComponent;
  let fixture: ComponentFixture<TicketItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketItemComponent);
    component = fixture.componentInstance;
  });

  it('should create the ticket item component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a ticket input property', () => {
    const dummyTicket: ticket = {
      id: '1',
      summary: 'Example Ticket',
      assignee: 'John Doe',
      assigned: 'true',
      group: 'Test group',
      priority: 'Low',
      startDate: 'Test start date',
      endDate: 'Test end date',
      status: 'Done',
    };
    component.ticket = dummyTicket;
    fixture.detectChanges();
    expect(component.ticket).toBe(dummyTicket);
  });
});
