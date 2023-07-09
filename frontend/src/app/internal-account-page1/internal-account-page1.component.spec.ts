import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalAccountPage1Component } from './internal-account-page1.component';

describe('InternalAccountPage1Component', () => {
  let component: InternalAccountPage1Component;
  let fixture: ComponentFixture<InternalAccountPage1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternalAccountPage1Component]
    });
    fixture = TestBed.createComponent(InternalAccountPage1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
