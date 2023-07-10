import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-manage-page3',
  templateUrl: './client-manage-page3.component.html',
  styleUrls: ['./client-manage-page3.component.scss']
})
export class ClientManagePage3Component {
  @Output() backClicked = new EventEmitter<void>();
  @Output() completeClicked = new EventEmitter<void>();

  constructor(private router: Router) {}

  hovered = false;

  toggleHover(){
    console.log('came in');
    this.hovered = !this.hovered;
  }

  onBackClicked(): void{
    this.backClicked.emit();
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
