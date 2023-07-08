import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountPage3Component } from './client-account-page3.component';

describe('ClientAccountPage3Component', () => {
  let component: ClientAccountPage3Component;
  let fixture: ComponentFixture<ClientAccountPage3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientAccountPage3Component]
    });
    fixture = TestBed.createComponent(ClientAccountPage3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
