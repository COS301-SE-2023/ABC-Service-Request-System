import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTabletComponent } from './group-tablet.component';

describe('GroupTabletComponent', () => {
  let component: GroupTabletComponent;
  let fixture: ComponentFixture<GroupTabletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupTabletComponent]
    });
    fixture = TestBed.createComponent(GroupTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
