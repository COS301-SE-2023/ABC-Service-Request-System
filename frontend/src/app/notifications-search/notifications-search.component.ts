import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { user } from '../../../../backend/src/models/user.model';
import { TicketsService } from 'src/services/ticket.service';
import { GroupService } from 'src/services/group.service';
import { ClientService } from 'src/services/client.service';
import { ticket } from '../../../../backend/src/models/ticket.model';
import { group } from '../../../../backend/src/models/group.model';
import { client, project } from '../../../../backend/src/models/client.model';

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
  resultsProjectName: project[]=[];
  allUsersArray: user[] = [];
  allTicketsArray: ticket[] = [];
  allGroupsArray: group[] = [];
  allClientsArray: client[] = [];
  searchResults: any[] = [];
  searchPerformed!: boolean;

  constructor(private userService: UserService, private ticketService: TicketsService, private groupService: GroupService, private clientService: ClientService){
  }

  sortUsers(users: user[]): user[] {
   // console.log(users);
    return users;
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
    console.log(groups);
    return groups;
  }

  ngOnInit(){
      this.searchQuery = '';
      this.searchPerformed = false;
  }
 setResultsUsers(temp:user[]){
  this.resultsUsers = temp;
  //console.log('resultsUser in set',this.resultsUsers)
 }
  onSearch(){
    this.searchPerformed = true;
    //Searches the users by name - works
    this.userService.getAllUsers().subscribe((response:user[])=> {
      this.allUsersArray = this.sortUsers(response);
      const resultsFromUsers = this.allUsersArray.filter(item=>item.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
      this.setResultsUsers(resultsFromUsers);
    });
    //searches the clients by organisation - works
    this.clientService.getAllClients().subscribe((response:client[])=>{
      this.allClientsArray = this.sortClients(response);
      const resultsFromCLients = this.allClientsArray.filter(item=>item.organisation.toLowerCase().includes(this.searchQuery.toLowerCase()));
      this.resultsClients = resultsFromCLients;
    })
    //searches the clients by name - works with some bugs
    this.clientService.getAllClients().subscribe((response:client[])=>{
      this.allClientsArray = this.sortClients(response);
      const resultsFromCLients = this.allClientsArray.filter(item=>item.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
      this.resultsClientsName = resultsFromCLients;
    })
    //searches the tickets by assigned - works
    this.ticketService.getAllTickets().subscribe((response:ticket[])=>{
    this.allTicketsArray = this.sortTickets(response);
    const resultsFromTickets = this.allTicketsArray.filter(item=>item.assigned.toLowerCase().includes(this.searchQuery.toLowerCase()));
    this.resultsTicketsAssigned = resultsFromTickets;
   })
   //searches the tickets by summary - works
    this.ticketService.getAllTickets().subscribe((response:ticket[])=>{
    this.allTicketsArray = this.sortTickets(response);
    const resultFromTickets = this.allTicketsArray.filter(item=>item.summary.toLowerCase().includes(this.searchQuery.toLowerCase()));
    this.resultsTicketsSummary = resultFromTickets;
   })
   //searches the clients by projects
  //  this.clientService.getAllClients().subscribe((response:client[])=>{
  //   this.allClientsArray = this.sortClients(response);
  //   const resultsProjectName = this.allClientsArray.filter(item=>item.projects.filter(nItem=>nItem.name.toLowerCase().includes(this.searchQuery)));
  //   this.resultsProjectName = resultsProjectName;
  //   console.log('Project:',this.resultsProjectName);
  //  });

  //searches groups by name
    this.groupService.getGroups().subscribe((response:group[])=>{
    this.allGroupsArray = this.sortGroups(response);
    const resultGroup = this.allGroupsArray.filter(item=>item.groupName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    this.resultsGroup = resultGroup;
    console.log("group:", this.resultsGroup);
  })
  }
}
