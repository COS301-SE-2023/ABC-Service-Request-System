import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchItemUserComponent } from './search-item-user.component';

describe('SearchItemUserComponent', () => {
  let component: SearchItemUserComponent;
  let fixture: ComponentFixture<SearchItemUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchItemUserComponent]
    });
    fixture = TestBed.createComponent(SearchItemUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
