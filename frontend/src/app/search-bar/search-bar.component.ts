import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Output() searchEvent = new EventEmitter<string>();
  searchTerm = '';

  searchTicket(): void {
    this.searchEvent.emit(this.searchTerm);
  }

  @Output() filterChangeEvent = new EventEmitter<string>();
  @Output() filterChangeProjectEvent = new EventEmitter<string>();
  filterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.filterChangeEvent.emit(selectElement.value);
    this.filterChangeProjectEvent.emit('project');
  }
}
