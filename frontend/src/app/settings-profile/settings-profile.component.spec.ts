import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsProfileComponent } from './settings-profile.component';

describe('SettingsProfileComponent', () => {
  let component: SettingsProfileComponent;
  let fixture: ComponentFixture<SettingsProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsProfileComponent]
    });
    fixture = TestBed.createComponent(SettingsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
