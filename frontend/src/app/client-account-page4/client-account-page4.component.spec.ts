import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountPage4Component } from './client-account-page4.component';

describe('ClientAccountPage4Component', () => {
  let component: ClientAccountPage4Component;
  let fixture: ComponentFixture<ClientAccountPage4Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientAccountPage4Component]
    });
    fixture = TestBed.createComponent(ClientAccountPage4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
