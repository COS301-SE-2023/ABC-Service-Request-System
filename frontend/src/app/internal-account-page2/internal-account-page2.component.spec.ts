import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalAccountPage2Component } from './internal-account-page2.component';

describe('InternalAccountPage2Component', () => {
  let component: InternalAccountPage2Component;
  let fixture: ComponentFixture<InternalAccountPage2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternalAccountPage2Component]
    });
    fixture = TestBed.createComponent(InternalAccountPage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
