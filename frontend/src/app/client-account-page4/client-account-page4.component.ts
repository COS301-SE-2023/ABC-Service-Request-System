import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-account-page4',
  templateUrl: './client-account-page4.component.html',
  styleUrls: ['./client-account-page4.component.scss']
})
export class ClientAccountPage4Component {

  constructor(private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
