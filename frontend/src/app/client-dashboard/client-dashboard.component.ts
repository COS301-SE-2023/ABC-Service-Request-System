import { Component, OnInit } from '@angular/core';
import { client } from '../../../../backend/clients/src/models/client.model';
import { AuthService } from 'src/services/auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  loggedInClient$!: Observable<client>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loggedInClient$ = this.authService.getLoggedInClient();
  }

}
