import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { client, project } from "../../../backend/src/models/client.model";
import { group } from "../../../backend/src/models/group.model";

@Injectable({
  providedIn: 'root'
})

export class ClientService {
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

  getClientByProjectName(projectName: string) {
    return this.http.get<client>(`${this.CLIENT_URL}/project?projectName=${projectName}`);
  }

  removeGroupFromProject(clientId: string, projectId: string, groupId: string) {
    return this.http.put<project>(`${this.CLIENT_URL}/remove_group`, {clientId: clientId, projectId: projectId, groupId: groupId});
  }

  deleteClient(clientId: string) {
    console.log("clientId in service: ", clientId);
    return this.http.delete<client>(`${this.CLIENT_URL}/delete_client`, { params: { clientId: clientId } });
  }

  addGroupToProject(clientId: string, projectId: string, newGroup: group) {
    console.log("clientId in service: ", clientId);
    return this.http.post<project>(`${this.CLIENT_URL}/add_group`, {clientId: clientId, projectId: projectId, newGroup: newGroup});
  }

  addProject(formData: any) {
    console.log('in service', formData);
    return this.http.post<any>(`${this.CLIENT_URL}/add_project`, formData);
  }
}
