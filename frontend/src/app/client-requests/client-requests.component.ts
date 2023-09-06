import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/services/navbar.service';

@Component({
  selector: 'app-client-requests',
  templateUrl: './client-requests.component.html',
  styleUrls: ['./client-requests.component.scss']
})
export class ClientRequestsComponent implements OnInit {

  constructor(private navbarService: NavbarService) {}

  navbarIsCollapsed!: boolean;

  ngOnInit(): void {
    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
    });
  }
}
