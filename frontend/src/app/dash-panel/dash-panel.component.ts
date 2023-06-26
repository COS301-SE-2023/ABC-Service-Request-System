import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dash-panel',
  templateUrl: './dash-panel.component.html',
  styleUrls: ['./dash-panel.component.scss']
})
export class DashPanelComponent {
  @Output() openForm = new EventEmitter<void>();
  @Input() tickets: any[] = [];

  constructor(public authService: AuthService, private router: Router) {}

  openNewTicketForm() {
    // Check if the user is a manager before emitting the event
    if (this.authService.isManager()) {
      this.openForm.emit();
    }
  }

  openCreateAccount() {
    console.log("openCreateAccount called");
    this.router.navigate(['/create-account']);
  }

  openSettings(){
    console.log("settings page called");
    this.router.navigate(['/settings']);
  }
}
