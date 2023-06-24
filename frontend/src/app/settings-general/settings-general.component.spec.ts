import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsGeneralComponent } from './settings-general.component';

describe('SettingsGeneralComponent', () => {
  let component: SettingsGeneralComponent;
  let fixture: ComponentFixture<SettingsGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsGeneralComponent]
    });
    fixture = TestBed.createComponent(SettingsGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
