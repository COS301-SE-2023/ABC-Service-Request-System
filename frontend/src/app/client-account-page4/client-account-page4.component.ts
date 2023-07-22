import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { client } from '../../../../backend/clients/src/models/client.model';

@Component({
  selector: 'app-client-account-page4',
  templateUrl: './client-account-page4.component.html',
  styleUrls: ['./client-account-page4.component.scss']
})
export class ClientAccountPage4Component {
  @Input() createdClient!: client;

  constructor(private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
