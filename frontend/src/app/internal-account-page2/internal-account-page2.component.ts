import { Component, Input } from '@angular/core';
import { user } from '../../../../backend/users/src/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-internal-account-page2',
  templateUrl: './internal-account-page2.component.html',
  styleUrls: ['./internal-account-page2.component.scss']
})
export class InternalAccountPage2Component {
  @Input() createdUser!: user;

  constructor(private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
