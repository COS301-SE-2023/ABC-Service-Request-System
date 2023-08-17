import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLoginComponent } from './client-login.component';

describe('ClientLoginComponent', () => {
  let component: ClientLoginComponent;
  let fixture: ComponentFixture<ClientLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientLoginComponent]
    });
    fixture = TestBed.createComponent(ClientLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
