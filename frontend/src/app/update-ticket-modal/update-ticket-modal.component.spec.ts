import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UpdateTicketModalComponent } from './update-ticket-modal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('UpdateTicketModalComponent', () => {
  let component: UpdateTicketModalComponent;
  let fixture: ComponentFixture<UpdateTicketModalComponent>;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateTicketModalComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTicketModalComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the updateTicketForm with empty values', () => {
    const formValue = component.updateTicketForm.value;
    expect(formValue.id).toBe('');
    expect(formValue.newAssignee).toBe('');
  });

  it('should emit the newAssignee value when onSubmit is called', () => {
    spyOn(component.updateTicketEvent, 'emit');

    // Set the newAssignee value in the form
    component.updateTicketForm.patchValue({ newAssignee: 'John Doe' });

    // Call the onSubmit method
    component.onSubmit();

    // Expect the updateTicketEvent to have been emitted with the newAssignee value
    expect(component.updateTicketEvent.emit).toHaveBeenCalledWith('John Doe');
  });

  it('should reset the form after onSubmit is called', () => {
    spyOn(component.updateTicketForm, 'reset');

    // Call the onSubmit method
    component.onSubmit();

    // Expect the form to be reset
    expect(component.updateTicketForm.reset).toHaveBeenCalled();
  });
});
