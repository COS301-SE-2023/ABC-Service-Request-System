import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { client, project } from "../../../backend/clients/src/models/client.model";
import { group } from '../../../backend/groups/src/models/group.model';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ClientService {
  private projectsSubject = new BehaviorSubject<project | undefined>(undefined);
  private projectInitialized = false;

  project$ = this.projectsSubject.asObservable();

  CLIENT_URL = 'http://localhost:3000/api/client';

  constructor(private http: HttpClient, private router: Router) { }

  getAllClients() {
    return this.http.get<client[]>(`${this.CLIENT_URL}`);
  }

  createClient(formData: any) {
    console.log('in service', formData);
    return this.http.post<any>(`${this.CLIENT_URL}/create_client`, formData);
  }

  //bug can occur if seperate organisations have the same name and for this reason, when creating an organisation, we need to ensure that organisation name is not already in the db
  getClientsByOrganisationName(organisationName: string) {
    return this.http.get<client[]>(`${this.CLIENT_URL}/organisation?organisation=${organisationName}`);
  }

  getClientsByGroupName(groupName: string) {
    return this.http.get<client[]>(`${this.CLIENT_URL}/group?group=${groupName}`);
  }

  getClientByProjectName(projectName: string) {
    return this.http.get<client>(`${this.CLIENT_URL}/project?projectName=${projectName}`);
  }

  getProjectByObjectId(projectId: string) {
    return this.http.get<any>(`${this.CLIENT_URL}/project/id?projectId=${projectId}`);
  }

  removeGroupFromProject(clientId: string, projectId: string, groupName: string) {
    return this.http.put<project>(`${this.CLIENT_URL}/remove_group`, {clientId: clientId, projectId: projectId, groupName: groupName});
  }

  deleteClient(clientId: string) {
    console.log("clientId in service: ", clientId);
    return this.http.delete<client>(`${this.CLIENT_URL}/delete_client`, { params: { clientId: clientId } });
  }

  addGroupToProject(clientId: string, projectId: string, newGroup: group) {
    const body = {clientId, projectId, newGroup};
    console.log('body in service: ', body);
    return this.http.post<project>(`${this.CLIENT_URL}/add_group`, body);
  }

  addProject(formData: any) {
    console.log('in service', formData);
    return this.http.post<any>(`${this.CLIENT_URL}/add_project`, formData);
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
}
