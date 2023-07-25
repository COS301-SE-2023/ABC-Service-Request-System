import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchItemProjectComponent } from './search-item-project.component';

describe('SearchItemProjectComponent', () => {
  let component: SearchItemProjectComponent;
  let fixture: ComponentFixture<SearchItemProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchItemProjectComponent]
    });
    fixture = TestBed.createComponent(SearchItemProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
