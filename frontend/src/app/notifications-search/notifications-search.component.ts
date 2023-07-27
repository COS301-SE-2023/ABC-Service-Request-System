import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/services/navbar.service';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { user } from '../../../../backend/users/src/models/user.model';
import { TicketsService } from 'src/services/ticket.service';
import { GroupService } from 'src/services/group.service';
import { ClientService } from 'src/services/client.service';
import { ticket } from '../../../../backend/tickets/src/models/ticket.model';
import { group } from '../../../../backend/groups/src/models/group.model';
import { client, project } from '../../../../backend/clients/src/models/client.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-notifications-search',
  templateUrl: './notifications-search.component.html',
  styleUrls: ['./notifications-search.component.scss']
})
export class NotificationsSearchComponent implements OnInit {
  searchQuery!: string;
  resultsUsers: user[]=[];
  resultsGroup: group[]=[];
  resultsClients: client[]=[];
  resultsClientsName: client[] = [];
  resultsTicketsAssigned: ticket[]=[];
  resultsTicketsSummary: ticket[]=[];
  resultsTicketsDescription: ticket[]=[];
  resultsProjectName: project[]=[];
  resultsProject: client[]=[];
  allUsersArray: user[] = [];
  allTicketsArray: ticket[] = [];
  allGroupsArray: group[] = [];
  allClientsArray: client[] = [];

  searchResults: any[] = [];
  searchPerformed!: boolean;

  displayTickets!: boolean;
  displayGroups!: boolean;
  displayUsers!: boolean;
  displayClients!: boolean;
  displayProjects!: boolean;

  displayFilters!: boolean[];
  firstClick!: boolean;

  navbarIsCollapsed!: boolean;

  constructor(private userService: UserService, private ticketService: TicketsService, private groupService: GroupService, private clientService: ClientService, private router: Router, private navbarService: NavbarService, private sanitizer: DomSanitizer){
    this.displayTickets = true;
    this.displayGroups = true;
    this.displayUsers = true;
    this.displayClients = true;
    this.displayProjects = true;
  }

  sortUsers(users: user[]): user[] {
   // console.log(users);
    return users;
  }

  sortProjects(projects: project[]): project[]{
    return projects;
  }
  sortClients(clients: client[]):client[]{
    //console.log(clients);
    return clients;
  }

  sortTickets(tickets:ticket[]):ticket[]{
    //console.log(tickets);
    return tickets;
  }
  sortGroups(groups:group[]):group[]{
    //console.log(groups);
    return groups;
  }

  ngOnInit(){
      this.searchQuery = '';
      this.searchPerformed = false;
      this.navbarService.collapsed$.subscribe(collapsed => {
        this.navbarIsCollapsed = collapsed;
      });

      this.displayFilters = [true, true, true, true, true];
      this.firstClick = true;
  }
 setResultsUsers(temp:user[]){
  this.resultsUsers = temp;
  //console.log('resultsUser in set',this.resultsUsers)
 }
  onSearch(){
    const searchQuery = this.searchQuery;
    console.log('searchQuery:', searchQuery)
    this.searchPerformed = true;

      this.resultsClients = [];
      this.resultsClientsName = [];
      this.resultsGroup = [];
      this.resultsProjectName = [];
      this.resultsProject = [];
      this.resultsTicketsAssigned = [];
      this.resultsTicketsSummary = [];
      this.resultsTicketsDescription = [];
      this.resultsUsers = [];

    if(searchQuery.length==0)
    {
      this.resultsClients = [];
      this.resultsClientsName = [];
      this.resultsGroup = [];
      this.resultsProjectName = [];
      this.resultsProject = [];
      this.resultsTicketsAssigned = [];
      this.resultsTicketsSummary = [];
      this.resultsTicketsDescription = [];
      this.resultsUsers = [];
      console.log('Users:',this.resultsUsers)
      return;
    }
    //Searches the users by name - works
    else{
      if(this.displayUsers){
      this.userService.getAllUsers().subscribe((response:user[])=> {
        this.allUsersArray = this.sortUsers(response);
        const resultsFromUsers = this.allUsersArray.filter(item=>item.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
        this.setResultsUsers(resultsFromUsers);
      });
  }
    //searches the clients by organisation - works
    if(this.displayClients){
    this.clientService.getAllClients().subscribe((response:client[])=>{
      this.allClientsArray = this.sortClients(response);
      const resultsFromCLients = this.allClientsArray.filter(item=>item.organisation.toLowerCase().includes(this.searchQuery.toLowerCase()));
      this.resultsClients = resultsFromCLients;
    })
  }
    //searches the clients by name - works
    if(this.displayClients){
    this.clientService.getAllClients().subscribe((response:client[])=>{
      this.allClientsArray = this.sortClients(response);
      const resultsFromCLients = this.allClientsArray.filter(item=>item.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
      this.resultsClientsName = resultsFromCLients;
    })
  }
    //searches the tickets by assigned - works
    if(this.displayTickets){
    this.ticketService.getAllTickets().subscribe((response:ticket[])=>{
    this.allTicketsArray = this.sortTickets(response);
    const resultsFromTickets = this.allTicketsArray.filter(item=>item.assigned.toLowerCase().includes(this.searchQuery.toLowerCase()));
    this.resultsTicketsAssigned = resultsFromTickets;
   })
  }
   //searches the tickets by summary - works
   if(this.displayTickets){
    this.ticketService.getAllTickets().subscribe((response:ticket[])=>{
    this.allTicketsArray = this.sortTickets(response);
    const resultFromTickets = this.allTicketsArray.filter(item=>item.summary.toLowerCase().includes(this.searchQuery.toLowerCase()));
    this.resultsTicketsSummary = resultFromTickets;
   })
  }
  //searches the tickets by description - works
  if(this.displayTickets){
    this.ticketService.getAllTickets().subscribe((response:ticket[])=>{
    this.allTicketsArray = this.sortTickets(response);
    const resultFromTickets = this.allTicketsArray.filter(item=>item.description.toLowerCase().includes(this.searchQuery.toLowerCase()));
    this.resultsTicketsDescription = resultFromTickets;
   })
  }
   //searches the clients by projects - works
   if(this.displayProjects){
   this.clientService.getAllClients().subscribe((response:client[])=>{
    this.allClientsArray = this.sortClients(response);
    const resultsProjectName = this.allClientsArray.filter((item) =>
    item.projects.some((project)=>
    project.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
    this.resultsProject = resultsProjectName;
    const size = this.resultsProject[0].projects.length;
    for( let loop = 0; loop < size;loop++){
      if(this.resultsProject[0].projects[loop].name.toLowerCase().includes(this.searchQuery.toLowerCase())){
        //console.log('found');
        this.resultsProjectName.push(this.resultsProject[0].projects[loop]);
      }
    }
    console.log('Project:',this.resultsProjectName);
    // console.log('size', size);
   });
  }

  //searches groups by name - works
  if(this.displayGroups){
    this.groupService.getGroups().subscribe((response:group[])=>{
    this.allGroupsArray = this.sortGroups(response);
    const resultGroup = this.allGroupsArray.filter(item=>item.groupName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    this.resultsGroup = resultGroup;
    //console.log("group:", this.resultsGroup);
  })
  }
}
}

navigateToTicket(id: string) {
  this.router.navigate([`/ticket/${id}`]);
}

navigateToGroup(){
  this.router.navigate([`/teams`])
}

navigateToProfile(id: string) {
  console.log('in navigateToProfile, id = ' + id);
  this.router.navigate(['/view-profile'], { queryParams: { id: id } });
}

highlightButtonUsers(event: any) {

  if(event.target.classList.contains('selected'))
  {
    event.target.classList.remove('selected');
    this.displayFilters[0] = false;
    setTimeout(() => {
      this.multifilter(0);
    }, 100);
  }
  else{
    event.target.classList.add('selected');
    this.displayFilters[0] = true;
    setTimeout(() => {
      this.multifilter(0);
    }, 100);
  }
}

highlightButtonTickets(event: any) {

  if(event.target.classList.contains('selected'))
  {
    event.target.classList.remove('selected');
    this.displayFilters[1] = false;
    setTimeout(() => {
      this.multifilter(1);
    }, 100);
  }
  else{
    event.target.classList.add('selected');
    
    this.displayFilters[1] = true;
    setTimeout(() => {
      this.multifilter(1);
    }, 100);
  }
}

highlightButtonClients(event: any) {

  if(event.target.classList.contains('selected'))
  {
    event.target.classList.remove('selected');
    this.displayFilters[2] = false;
    setTimeout(() => {
      this.multifilter(2);
    }, 100);
  }
  else{
    event.target.classList.add('selected');
    
    this.displayFilters[2] = true;
    setTimeout(() => {
      this.multifilter(2);
    }, 100);
  }
}

highlightButtonGroups(event: any) {

  if(event.target.classList.contains('selected'))
  {
    event.target.classList.remove('selected');

    this.displayFilters[3] = false;
    setTimeout(() => {
      this.multifilter(3);
    }, 100);
  }
  else{
    event.target.classList.add('selected');
    
    this.displayFilters[3] = true;
    setTimeout(() => {
      this.multifilter(3);
    }, 100);
  }
}

highlightButtonProjects(event: any) {

  if(event.target.classList.contains('selected'))
  {
    event.target.classList.remove('selected');
    
    this.displayFilters[4] = false;
    setTimeout(() => {
      this.multifilter(4);
    }, 100);
  }
  else{
    event.target.classList.add('selected');
    

    this.displayFilters[4] = true;
    setTimeout(() => {
      this.multifilter(4);
    }, 100);
  }
}

multifilter(index: number) {
  let noSelected = true;
  const buttons = document.getElementsByClassName('filter-buttons');

  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].classList.contains('selected')) {
      console.log("Buttons ", i , buttons[i].classList.contains('selected'));
      noSelected = false;
    }
  }
  console.log("noSelected: ", noSelected);
  console.log("First Click: ", this.firstClick);

  

  if (noSelected === true) {
    this.displayClients = true;
    this.displayGroups = true;
    this.displayProjects = true;
    this.displayTickets = true;
    this.displayUsers = true;

    this.displayFilters[0] = true;
    this.displayFilters[1] = true;
    this.displayFilters[2] = true;
    this.displayFilters[3] = true;
    this.displayFilters[4] = true;

    this.firstClick = true;
  }
  else if (this.firstClick) {
    this.displayClients = false;
    this.displayGroups = false;
    this.displayProjects = false;
    this.displayTickets = false;
    this.displayUsers = false;

    this.displayFilters[0] = false;
    this.displayFilters[1] = false;
    this.displayFilters[2] = false;
    this.displayFilters[3] = false;
    this.displayFilters[4] = false;

    if (index == 0) {
      this.displayUsers = true;
      this.displayFilters[0] = true;
    }

    if (index == 1) {
      this.displayTickets = true;
      this.displayFilters[1] = true;
    }

    if (index == 2) {
      this.displayClients = true;
      this.displayFilters[2] = true;
    }

    if (index == 3) {
      this.displayGroups = true;
      this.displayFilters[3] = true;
    }

    if (index == 4) {
      this.displayProjects = true;
      this.displayFilters[4] = true;
    }

    this.firstClick = false;
  }
  else {
    this.displayClients = false;
    this.displayGroups = false;
    this.displayProjects = false;
    this.displayTickets = false;
    this.displayUsers = false;

    if (this.displayFilters[0] == true) {
      this.displayUsers = true;
    }

    if (this.displayFilters[1] == true) {
      this.displayTickets = true;
    }

    if (this.displayFilters[2] == true) {
      this.displayClients = true;
    }

    if (this.displayFilters[3] == true) {
      this.displayGroups = true;
    }

    if (this.displayFilters[4] == true) {
      this.displayProjects = true;
    }
  }

  console.log("displayUsers: ", this.displayFilters[0]);
  console.log("displayTickets: ", this.displayFilters[1]);
  console.log("displayClients: ", this.displayFilters[2]);
  console.log("displayGroups: ", this.displayFilters[3]);
  console.log("displayProjects: ", this.displayFilters[4]);
}
highlightDescription(description: string, searchQuery: string): string {
      if (!description || !searchQuery) {
      return description;
    }

    const searchIndex = description.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (searchIndex >= 0) {
      const before = searchIndex > 10 ? '...' : '';
      const after = searchIndex + searchQuery.length + 10 < description.length ? '...' : '';
      const context = description.substring(searchIndex - 10, searchIndex + searchQuery.length + 10);
      return `${before}${context}${after}`;
    }

    return description;
  }
}
