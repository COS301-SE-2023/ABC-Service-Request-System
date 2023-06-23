import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dash-panel',
  templateUrl: './dash-panel.component.html',
  styleUrls: ['./dash-panel.component.scss']
})
export class DashPanelComponent {
  @Output() openForm = new EventEmitter<void>();
  @Input() tickets: any[] = [];

  constructor(public authService: AuthService) {}

  openNewTicketForm() {
    // Check if the user is a manager before emitting the event
    if (this.authService.isManager()) {
      this.openForm.emit();
    }
  }
}
