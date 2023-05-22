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
}
