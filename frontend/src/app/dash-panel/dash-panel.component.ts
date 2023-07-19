import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NavbarService } from 'src/services/navbar.service';
@Component({
  selector: 'app-dash-panel',
  templateUrl: './dash-panel.component.html',
  styleUrls: ['./dash-panel.component.scss']
})
export class DashPanelComponent implements OnInit{
  @Output() openForm = new EventEmitter<void>();
  @Input() tickets: any[] = [];

  isCollapsed!: boolean;

  constructor(public authService: AuthService, private router: Router, public navbarService: NavbarService) { }

  ngOnInit(): void {
    this.navbarService.collapsed$.subscribe(collapsed => {
      this.isCollapsed = collapsed;
    });
  }

  toggleCollapse(){
    this.isCollapsed = !this.isCollapsed;
    this.navbarService.setCollapsedState(this.isCollapsed);
  }

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

  openTeams() {
    this.router.navigate(['/teams']);
  }

  openAnalytics(){
    console.log("analytics page called");
    this.router.navigate(['/analytics-page']);
  }

  //checking active route
  checkIfDashboardRoute(): boolean {
    const currentUrl = this.router.url;
    if (currentUrl) {
      return currentUrl.includes('dashboard') || /^\/ticket\/\d+$/.test(currentUrl);
    }
    return false;
  }
  
  checkIfGroupsRoute(): boolean {
    const currentUrl = this.router.url;
    if (currentUrl) {
      return currentUrl.includes('teams');
    }
    return false;
  }
  
  checkIfAnalyticsRoute(): boolean {
    const currentUrl = this.router.url;
    if (currentUrl) {
      return currentUrl.includes('analytics');
    }
    return false;
  }
  
  checkIfCreateAccountRoute(): boolean {
    const currentUrl = this.router.url;
    if (currentUrl) {
      return currentUrl.includes('create-account');
    }
    return false;
  }

  checkIfCreateTicketRoute(): boolean {
    const currentUrl = this.router.url;
    if (currentUrl) {
      return currentUrl.includes('/new-ticket-form');
    }
    return false;
  }

  checkIfProfileRoute(): boolean {
    const currentUrl = this.router.url;
    if (currentUrl) {
      return currentUrl.includes('settings');
    }
    return false;
  }
    
  // checkIfDashboardRoute(): boolean {
  //   return this.router.url.includes('dashboard') || /^\/ticket\/\d+$/.test(this.router.url);
  // }

  // checkIfGroupsRoute(): boolean {
  //   return this.router.url.includes('teams');
  // }

  // checkIfAnalyticsRoute(): boolean {
  //   return this.router.url.includes('analytics');
  // }

  // checkIfCreateAccountRoute(): boolean {
  //   return this.router.url.includes('create-account');
  // }

  // checkIfCreateTicketRoute(): boolean {
  //   return this.router.url.endsWith('/new-ticket-form');
  // }

  // checkIfProfileRoute(): boolean {
  //   return this.router.url.includes('settings');
  // }
}
