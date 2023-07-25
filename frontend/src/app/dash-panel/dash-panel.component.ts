import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NavbarService } from 'src/services/navbar.service';
import { ClientService } from 'src/services/client.service';
import { TicketsService } from 'src/services/ticket.service';
import { GroupService } from 'src/services/group.service';
import { project } from '../../../../backend/clients/src/models/client.model';
import { user } from '../../../../backend/users/src/models/user.model';
@Component({
  selector: 'app-dash-panel',
  templateUrl: './dash-panel.component.html',
  styleUrls: ['./dash-panel.component.scss']
})
export class DashPanelComponent implements OnInit{
  @Output() openForm = new EventEmitter<void>();
  @Input() tickets: any[] = [];

  isCollapsed!: boolean;
  allProjects: project[] = [];
  selectedProject!: project;
  isProjectOverlayOpen = false;

  constructor(public authService: AuthService, private router: Router, public navbarService: NavbarService, private clientService: ClientService, private ticketService: TicketsService, private groupService: GroupService) { }

  ngOnInit(): void {
    const isProjectInitialized = this.clientService.getInitialized();

    this.navbarService.collapsed$.subscribe(collapsed => {
      this.isCollapsed = collapsed;
    });

    let currentUser!: user;

    this.authService.getUserObject().subscribe(
      (res) => {
        currentUser = res;

        console.log('current user: ', currentUser);
        console.log('current groups: ', currentUser.groups);
        currentUser.groups.forEach((group) => {

          if(group){
            let groupName = '';
            this.groupService.getGroupNameById(group).subscribe(
              (response) => {
                groupName = response.groupName;

                this.clientService.getClientsByGroupName(groupName).subscribe(
                  (response) => {
                    response.forEach(client => {
                      client.projects.forEach(project => {
                        if (!this.allProjects.some(p => p.name === project.name)) {
                          this.allProjects.push(project);
                          this.selectedProject = this.allProjects[0];
                          if(!isProjectInitialized){
                            this.clientService.setProjectsObservables(this.selectedProject);
                            this.clientService.setInitialized();
                          }

                          const projectsObservable = this.clientService.getProjectsObservable();
                          if (projectsObservable !== undefined) {
                            projectsObservable.subscribe((project) => {
                              if (project !== undefined) {
                                this.selectedProject = project;
                              }
                            });
                          }

                        }
                      })
                    })
                  }, (error) => {
                    console.log("Error fetching clients with groupName");
                  }
                )
              }, (error) => {
                console.log("Error fetching groupName with groupId", error);
              }
            );
          }

        });
      }
    )

    console.log(this.allProjects, ' all projects');
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
    this.router.navigate(['/create-account'], { queryParams: { home: true } });
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

  //overlay functions
  selectOption(project: project){
    this.selectedProject = project;

    this.clientService.setProjectsObservables(this.selectedProject);

    this.toggleProjectOverlay();
    console.log(this.selectedProject);
  }

  toggleProjectOverlay() {
    this.isProjectOverlayOpen = !this.isProjectOverlayOpen;
  }
}
