import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsNotificationsComponent } from './settings-notifications.component';

describe('SettingsNotificationsComponent', () => {
  let component: SettingsNotificationsComponent;
  let fixture: ComponentFixture<SettingsNotificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsNotificationsComponent]
    });
    fixture = TestBed.createComponent(SettingsNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
