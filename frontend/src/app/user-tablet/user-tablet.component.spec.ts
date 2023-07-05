import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTabletComponent } from './user-tablet.component';

describe('UserTabletComponent', () => {
  let component: UserTabletComponent;
  let fixture: ComponentFixture<UserTabletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserTabletComponent]
    });
    fixture = TestBed.createComponent(UserTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
