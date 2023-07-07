import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountPage2Component } from './client-account-page2.component';

describe('ClientAccountPage2Component', () => {
  let component: ClientAccountPage2Component;
  let fixture: ComponentFixture<ClientAccountPage2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
