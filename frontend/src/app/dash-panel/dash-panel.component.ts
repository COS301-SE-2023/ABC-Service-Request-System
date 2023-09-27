import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NavbarService } from 'src/services/navbar.service';
import { ClientService } from 'src/services/client.service';
import { TicketsService } from 'src/services/ticket.service';
import { GroupService } from 'src/services/group.service';
import { project } from '../../../../backend/clients/src/models/client.model';
import { user } from '../../../../backend/users/src/models/user.model';
import { ThemeService } from 'src/services/theme.service';
import * as DarkReader from 'darkreader';

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

  isDarkMode!: boolean;



  constructor(public authService: AuthService, private router: Router, public navbarService: NavbarService, private clientService: ClientService, private ticketService: TicketsService, private groupService: GroupService,
    private themeService: ThemeService ) {
    this.themeService.initTheme();
    this.isDarkMode = this.themeService.isDarkMode();
    // alert(this.selectedProject);
    // localStorage.setItem('selectedProject', JSON.stringify(this.selectedProject));
  }

  onSelectProject(project: any) {
    this.selectedProject = project;
    // localStorage.setItem('selectedProject', JSON.stringify(this.selectedProject));
    this.authService.setSelectedProject(project);
    this.router.navigate(['/dashboard']);
  }

  ngOnInit(): void {
    //dark mode preference
    this.checkDarkModePreference();
    const isProjectInitialized = this.clientService.getInitialized();

    this.navbarService.collapsed$.subscribe(collapsed => {
      this.isCollapsed = collapsed;
    });

    let currentUser!: user;
    // localStorage.setItem('selectedProject', 'null');

    if(this.authService.getUser() != null || undefined) {
      this.authService.getUserObject().subscribe(
        (res) => {
          currentUser = res;
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


                            // const itemFromLocalStorage = localStorage.getItem('selectedProject');
                            // console.log('item from local storage');
                            // console.log(itemFromLocalStorage);
                            // if (itemFromLocalStorage !== null && itemFromLocalStorage !== 'null') {
                            //   // alert('made it through');
                            //   const savedData = JSON.parse(itemFromLocalStorage);
                            //   if (savedData !== null) {
                            //     this.selectedProject = savedData;
                            //   }
                            // } else {
                            //   this.selectedProject = this.allProjects[0];
                            // }

                            if (localStorage.getItem('selectedProject')) {
                              const projectStorage = JSON.parse(localStorage.getItem('selectedProject')!);
                              this.selectedProject = projectStorage;
                            } else {
                              this.selectedProject = this.allProjects[0];
                            }


                            if(!isProjectInitialized){
                              this.clientService.setProjectsObservables(this.selectedProject);
                              this.clientService.setInitialized();
                            }

                            const projectsObservable = this.clientService.getProjectsObservable();
                            if (projectsObservable !== undefined) {
                              projectsObservable.subscribe((project) => {
                                if (project !== undefined) {
                                  if (localStorage.getItem('selectedProject')) {
                                    const projectStorage = JSON.parse(localStorage.getItem('selectedProject')!);
                                    this.selectedProject = projectStorage;
                                  } else {
                                    this.selectedProject = project;
                                  }
                                  // this.selectedProject = project;
                                  // console.log(this.selectedProject);
                                  localStorage.setItem('selectedProject', JSON.stringify(this.selectedProject));
                                }
                              });
                            }

                          }
                        })
                      })

                      this.sortProjects(this.allProjects);

                    }, (error) => {
                      console.log("Error fetching clients with groupName");
                    })
                }, (error) => {
                  console.log("Error fetching groupName with groupId", error);
                }
              );
            }

          });
        }
      )
    }

}

  sortProjects(projects: project[]){
    this.allProjects = projects.sort((a, b) => a.name.localeCompare(b.name));
  }

  toggleCollapse(){
    this.isCollapsed = !this.isCollapsed;
    this.navbarService.setCollapsedState(this.isCollapsed);
  }

  openNewTicketForm() {
    this.router.navigate(['/new-ticket-form']);
  }

  openClientRequests() {
    this.router.navigate(['/client-requests']);
  }

  openCreateAccount() {
    this.router.navigate(['/create-account'], { queryParams: { home: true } });
  }

  openSettings(){
    this.router.navigate(['/settings']);
  }

  openDashboard(){
    this.router.navigate(['/dashboard']);
  }

  openTeams() {
    this.router.navigate(['/teams']);
  }

  openAnalytics(){
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

  checkIfClientRequestsRoute(): boolean {
    const currentUrl = this.router.url;
    if (currentUrl) {
      return currentUrl.includes('client-requests');
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
    localStorage.setItem('selectedProject', JSON.stringify(this.selectedProject));
    this.clientService.setProjectsObservables(this.selectedProject);
    this.authService.setSelectedProject(this.selectedProject.name);
    this.toggleProjectOverlay();
    this.router.navigate(['/dashboard']);
  }

  toggleProjectOverlay() {
    this.isProjectOverlayOpen = !this.isProjectOverlayOpen;
  }

  checkDarkModePreference(): void {
    const darkModeSetting = localStorage.getItem('darkMode');
    if (darkModeSetting === 'enabled') {
      this.enableDarkMode();
    } else if (darkModeSetting === 'disabled') {
      DarkReader.disable();
    }
  }

  toggleDarkMode(): void {
      if (DarkReader.isEnabled()) {
        DarkReader.disable();
        localStorage.setItem('darkMode', 'disabled');
      } else {
        this.enableDarkMode();
        localStorage.setItem('darkMode', 'enabled');
      }
  }

  enableDarkMode(): void {
    // Set the fetch method for DarkReader
    DarkReader.setFetchMethod(window.fetch);
    
    // Now enable DarkReader
    DarkReader.enable({
        brightness: 80,
        contrast: 100,
        sepia: 10
    });
  }
  

}
