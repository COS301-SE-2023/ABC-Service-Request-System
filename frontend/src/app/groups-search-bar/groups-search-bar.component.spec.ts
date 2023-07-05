import { ComponentFixture, TestBed } from '@angular/core/testing';


import { GroupsSearchBarComponent } from './groups-search-bar.component';

describe('GroupsSearchBarComponent', () => {
  let component: GroupsSearchBarComponent;
  let fixture: ComponentFixture<GroupsSearchBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupsSearchBarComponent]
    });
    fixture = TestBed.createComponent(GroupsSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
