import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

import { ClientAccountPage2Component } from './client-account-page2.component';

describe('ClientAccountPage2Component', () => {
  let component: ClientAccountPage2Component;
  let fixture: ComponentFixture<ClientAccountPage2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule], // Add ReactiveFormsModule to imports
      declarations: [ClientAccountPage2Component]
    });
    fixture = TestBed.createComponent(ClientAccountPage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
