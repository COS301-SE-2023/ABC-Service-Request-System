import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar.component';
import { EventEmitter } from '@angular/core';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule], // Add FormsModule import
      declarations: [SearchBarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the search bar component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search event with the search term', () => {
    const searchValue = 'test';
    let emittedSearchTerm: string | undefined;
    component.searchEvent.subscribe((term: string) => {
      emittedSearchTerm = term;
    });

    component.searchTerm = searchValue;
    component.searchTicket();

    expect(emittedSearchTerm).toBe(searchValue);
  });
});
