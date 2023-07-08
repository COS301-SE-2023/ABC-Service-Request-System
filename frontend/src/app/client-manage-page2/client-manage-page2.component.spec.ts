import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientManagePage2Component } from './client-manage-page2.component';

describe('ClientManagePage2Component', () => {
  let component: ClientManagePage2Component;
  let fixture: ComponentFixture<ClientManagePage2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientManagePage2Component]
    });
    fixture = TestBed.createComponent(ClientManagePage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
