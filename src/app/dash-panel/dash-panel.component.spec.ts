import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashPanelComponent } from './dash-panel.component';

describe('DashPanelComponent', () => {
  let component: DashPanelComponent;
  let fixture: ComponentFixture<DashPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
