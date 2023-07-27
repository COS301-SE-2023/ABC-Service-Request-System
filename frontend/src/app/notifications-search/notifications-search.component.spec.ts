import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSearchComponent } from './notifications-search.component';

describe('NotificationsSearchComponent', () => {
  let component: NotificationsSearchComponent;
  let fixture: ComponentFixture<NotificationsSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsSearchComponent]
    });
    fixture = TestBed.createComponent(NotificationsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
