import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchItemClientComponent } from './search-item-client.component';

describe('SearchItemClientComponent', () => {
  let component: SearchItemClientComponent;
  let fixture: ComponentFixture<SearchItemClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchItemClientComponent]
    });
    fixture = TestBed.createComponent(SearchItemClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
