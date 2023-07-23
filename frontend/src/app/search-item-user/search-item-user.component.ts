import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search-item-user',
  templateUrl: './search-item-user.component.html',
  styleUrls: ['./search-item-user.component.scss']
})
export class SearchItemUserComponent {
  @Input() data:any;
}
