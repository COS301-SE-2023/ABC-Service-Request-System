import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientManagePage3Component } from './client-manage-page3.component';

describe('ClientManagePage3Component', () => {
  let component: ClientManagePage3Component;
  let fixture: ComponentFixture<ClientManagePage3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientManagePage3Component]
    });
    fixture = TestBed.createComponent(ClientManagePage3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
