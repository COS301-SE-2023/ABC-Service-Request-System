import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-client-account-page1',
  templateUrl: './client-account-page1.component.html',
  styleUrls: ['./client-account-page1.component.scss']
})
export class ClientAccountPage1Component {
  @Output() createAccountClicked = new EventEmitter<void>();
  @Output() manageAccountClicked = new EventEmitter<void>();

  onCreateAccount(): void {
    this.createAccountClicked.emit();
  }

  onManageAccount(): void {
    this.manageAccountClicked.emit();
  }
}
