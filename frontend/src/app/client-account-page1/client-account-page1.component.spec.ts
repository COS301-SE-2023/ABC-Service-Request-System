import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountPage1Component } from './client-account-page1.component';

describe('ClientAccountPage1Component', () => {
  let component: ClientAccountPage1Component;
  let fixture: ComponentFixture<ClientAccountPage1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientAccountPage1Component]
    });
    fixture = TestBed.createComponent(ClientAccountPage1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
