import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NavbarService } from 'src/services/navbar.service';
import { ClientService } from 'src/services/client.service';
import { TicketsService } from 'src/services/ticket.service';
import { GroupService } from 'src/services/group.service';
import { project } from '../../../../backend/src/models/client.model';
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

    const currentUser = this.authService.getUser();

    console.log('current groups: ', currentUser.groups);
    currentUser.groups.forEach((group) => {
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
    });

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
    return this.router.url.includes('dashboard') || /^\/ticket\/\d+$/.test(this.router.url);
  }

  checkIfGroupsRoute(): boolean {
    return this.router.url.includes('teams');
  }

  checkIfAnalyticsRoute(): boolean {
    return this.router.url.includes('analytics');
  }

  checkIfCreateAccountRoute(): boolean {
    return this.router.url.includes('create-account');
  }

  checkIfCreateTicketRoute(): boolean {
    return this.router.url.endsWith('/new-ticket-form');
  }

  checkIfProfileRoute(): boolean {
    return this.router.url.includes('settings');
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
