import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTicketFormComponent } from './new-ticket-form.component';

describe('NewTicketFormComponent', () => {
  let component: NewTicketFormComponent;
  let fixture: ComponentFixture<NewTicketFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewTicketFormComponent]
    });
    fixture = TestBed.createComponent(NewTicketFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
