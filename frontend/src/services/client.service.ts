import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { client, project } from "../../../backend/clients/src/models/client.model";
import { group } from '../../../backend/groups/src/models/group.model';
import { BehaviorSubject, Observable, tap, interval } from "rxjs";
import { environment } from '../environments/environment';
import { switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class ClientService {
  private projectsSubject = new BehaviorSubject<project | undefined>(undefined);
  private projectInitialized = false;



  project$ = this.projectsSubject.asObservable();

  CLIENT_URL = environment.CLIENT_URL;
  FRONTEND_CLIENT_LOGIN_URL = environment.FRONTEND_CLIENT_LOGIN_URL;
  USER_URL = environment.USER_URL;

  private token!: string | null;

  constructor(private http: HttpClient, private router: Router) { }

  getAllClients() {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<client[]>(`${this.CLIENT_URL}`, {headers});
  }

  createClient(formData: any) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    // console.log('in service', formData);
    return this.http.post<any>(`${this.CLIENT_URL}/create_client`, formData, {headers});
  }

  activateAccount(accountDetails: { inviteToken: string, password: string }): Observable<any> {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.post(`${this.CLIENT_URL}/activate_account`, accountDetails, { headers })
      .pipe(
        tap((response: any) => {
          if (response.message === 'Account activated successfully') {
            console.log("newest url is: ", this.FRONTEND_CLIENT_LOGIN_URL);
            // this.router.navigateByUrl(this.FRONTEND_CLIENT_LOGIN_URL);
          }
        })
      );
  }

  loginClient(userDetails: { email: string, password: string }) {
    console.log("called login at route: ", this.CLIENT_URL);
    return this.http.post(`${this.CLIENT_URL}/login`, userDetails);
  }

  //bug can occur if seperate organisations have the same name and for this reason, when creating an organisation, we need to ensure that organisation name is not already in the db
  getClientsByOrganisationName(organisationName: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<client[]>(`${this.CLIENT_URL}/organisation?organisation=${organisationName}`, {headers});
  }

  getClientsByGroupName(groupName: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    // console.log("client url should be luna but instead is: ", this.CLIENT_URL);
    // console.log("while user url is: ", this.USER_URL);
    return this.http.get<client[]>(`${this.CLIENT_URL}/group?group=${groupName}`, {headers});
  }

  getClientByProjectName(projectName: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<client>(`${this.CLIENT_URL}/project?projectName=${projectName}`, {headers});
  }

  getProjectByObjectId(projectId: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<any>(`${this.CLIENT_URL}/project/id?projectId=${projectId}` , {headers});
  }

  getProjectByProjectIdAndClienId(projectId: string, clientId: string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<project>(`${this.CLIENT_URL}/project/client?projectId=${projectId}&clientId=${clientId}`, {headers});
  }

  removeGroupFromProject(clientId: string, projectId: string, groupsToRemove: string []) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    // console.log("in remove group service");
    return this.http.put<project>(`${this.CLIENT_URL}/remove_group`, {clientId: clientId, projectId: projectId, groupsToRemove: groupsToRemove} , {headers});
  }

  deleteClient(clientId: string) {
    // this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage:', this.token);
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    // console.log("clientId in service: ", clientId);
    return this.http.delete<client>(`${this.CLIENT_URL}/delete_client`, { params: { clientId: clientId } });
  }

  addGroupsToProject(clientId: string, projectId: string, newGroups: group []) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const body = {clientId, projectId, newGroups};
    // console.log('body in service: ', body);
    return this.http.post<project>(`${this.CLIENT_URL}/add_group`, body, {headers});
  }

  editPriorities(clientId: string, projectId: string, lowPriorityTime: string, mediumPriorityTime:string, highPriorityTime:string) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const body = {clientId, projectId, lowPriorityTime, mediumPriorityTime, highPriorityTime};
    // console.log('body in service: ', body);
    return this.http.put<project>(`${this.CLIENT_URL}/edit_priorities`, body, {headers});
  }

  addProject(formData: any) {
    this.token = localStorage.getItem('token'); // retrieve token from localStorage
    // console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    // console.log('in service', formData);
    return this.http.post<any>(`${this.CLIENT_URL}/add_project`, formData, {headers});
  }

  //projects observable
  setProjectsObservables(project: project): void {
    this.projectsSubject.next(project);
  }

  getProjectsObservable(): Observable<project | undefined>{
    return this.projectsSubject.asObservable();
  }

  setInitialized(): void {
    this.projectInitialized = true;
  }

  getInitialized(): boolean {
    return this.projectInitialized;
  }

  //clients dashboard
  addProjectRequest(projectName: string, additionalInformation: string, clientId: string) {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const body = {
      projectName: projectName,
      additionalInformation: additionalInformation,
      clientId: clientId
    }

    return this.http.post<any>(`${this.CLIENT_URL}/project_request`, body, {headers});
  }

  addTicketRequest(projectSelected: string, summary: string, description: string, priority: string, clientId: string, projectId: string, endDate:string) {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const body = {
      projectSelected: projectSelected,
      summary: summary,
      description: description,
      priority: priority,
      clientId: clientId,
      projectId: projectId,
      endDate: endDate
    }

    return this.http.post<any>(`${this.CLIENT_URL}/ticket_request`, body, {headers});
  }

  getAllClientsWithAllRequests() {
    this.token = localStorage.getItem('token');
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<client[]>(`${this.CLIENT_URL}/all_requests`, {headers});
  }

  updateRequest(clientId: string, requestId: string, status: string) {
    this.token = localStorage.getItem('token');
    console.log('Token from storage:', this.token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const body = {
      clientId: clientId,
      requestId: requestId,
      status: status
    }

    return this.http.put<any>(`${this.CLIENT_URL}/update_request`, body, {headers});
  }

  getClientById(clientId: string) {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<client>(`${this.CLIENT_URL}/id?id=${clientId}`, {headers});
  }

  //chat room
  setChatId(clientId: string, roomId: string) {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const body = {
      clientId: clientId,
      roomId: roomId
    }

    return this.http.post<any>(`${this.CLIENT_URL}/chatId`, body, {headers});
  }

  getCallingClientsQuick() {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<client[]>(`${this.CLIENT_URL}/calling`, {headers});
  }

  getCallingClients(): Observable<any> {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return interval(5000) // Poll every 5 seconds (adjust as needed)
      .pipe(
        switchMap(() => this.http.get<client[]>(`${this.CLIENT_URL}/calling`, {headers})
      ));
  }

  resetCallingClient(clientId: string) {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const body = {
      clientId: clientId
    }

    return this.http.put<any>(`${this.CLIENT_URL}/calling_reset`, body, {headers});
  }

  getGroupsIdsForClientAndProject(clientId: string, projectId: string) {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    console.log('cliiiii id: ', clientId);
    console.log('projecttttt id: ', projectId);


    return this.http.get<any>(`${this.CLIENT_URL}/groupIDs?clientId=${clientId}&projectId=${projectId}`, {headers});
  }
}
