import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsPageComponent } from './teams-page.component';

describe('TeamsPageComponent', () => {
  let component: TeamsPageComponent;
  let fixture: ComponentFixture<TeamsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamsPageComponent]
    });
    fixture = TestBed.createComponent(TeamsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
