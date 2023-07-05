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
    console.log("openNewTicketForm called");
    this.router.navigate(['/new-ticket-form']);
  }

  openCreateAccount() {
    console.log("openCreateAccount called");
    this.router.navigate(['/create-account']);
  }

  openSettings(){
    console.log("settings page called");
    this.router.navigate(['/settings']);
  }

  openDashboard(){
    console.log("dashboard page called");
    this.router.navigate(['/dashboard']);
  }

  openAnalytics(){
    console.log("analytics page called");
    this.router.navigate(['/analytics-page']);
  }
}
