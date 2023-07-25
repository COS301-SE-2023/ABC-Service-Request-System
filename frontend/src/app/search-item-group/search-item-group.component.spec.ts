import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchItemGroupComponent } from './search-item-group.component';

describe('SearchItemGroupComponent', () => {
  let component: SearchItemGroupComponent;
  let fixture: ComponentFixture<SearchItemGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchItemGroupComponent]
    });
    fixture = TestBed.createComponent(SearchItemGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
