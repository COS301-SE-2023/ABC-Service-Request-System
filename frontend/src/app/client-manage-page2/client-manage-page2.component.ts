import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { client, project } from '../../../../backend/clients/src/models/client.model';
import { ClientService } from 'src/services/client.service';
import { group } from '../../../../backend/groups/src/models/group.model';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { GroupService } from 'src/services/group.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-client-manage-page2',
  templateUrl: './client-manage-page2.component.html',
  styleUrls: ['./client-manage-page2.component.scss']
})
export class ClientManagePage2Component implements OnInit{
  @Output() backClicked = new EventEmitter<void>();
  @Output() completeClicked = new EventEmitter<void>();
  @Output() editClicked: EventEmitter<{ selectedClient: client, projectToEdit: project }> = new EventEmitter<{ selectedClient: client, projectToEdit: project }>();

  @Input() selectedClient!: client;

  allClients: client[] = [];
  allClients2$!: Observable<client[]>
  allProjects: project[] = [];
  projectGroups: group[] = [];

  selectedProject!: project;

  isAddGroupOverlayOpened = false;
  isRemoveClientOverlayOpened = false;
  isRemoveProjectOverlayOpened = false;
  groupControl = new FormControl('');
  filteredOptions!: Observable<string[]>;
  allGroups: group[] = [];
 // selectedGroups: group[] = [];
  selectedGroupsForm: FormArray;
  groupSelected = false;
  projectSelected = false;
  clientToRemove!: client | null;
  projectToRemove!: project | null;

  constructor(private clientService: ClientService, private groupService: GroupService, private formBuilder: FormBuilder, private router: Router) {
    this.selectedGroupsForm = this.formBuilder.array([]);
  }

  ngOnInit(): void {
    console.log("managing client: ", this.selectedClient);

    this.getAllClientsByOrganisationName();

    this.allClients2$ = this.clientService.getClientsByOrganisationName(this.selectedClient.organisation);

    //GETTING ALL THE GROUPS
    this.groupService.getGroups().subscribe(
      (result: group[]) => {
        result.forEach(item => {
          this.allGroups.push(item);
          // this.allGroupIds.push(item.id);
        });
      },
      (error: any) => {
        console.log('Error fetching all groups', error);
      }
    );

    this.filteredOptions = this.groupControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allGroups
    .filter(option => option.groupName.toLowerCase().includes(filterValue))
    .map(option => option.groupName);
  }

  getAllClientsByOrganisationName() {
    this.clientService.getClientsByOrganisationName(this.selectedClient.organisation).subscribe(
      (response) => {
        this.allClients = response;
        this.groupAllProjectsForSelectedOrganisation();
      }, (error) => {
        console.log("Error fetching all clients by organisation name - component.ts", error);
      }
    )
  }

  groupAllProjectsForSelectedOrganisation() {
    // this.allClients.forEach((client) => {
    //   client.projects.forEach((project) => {
    //     const isExistingProject = this.allProjects.some((existingProject) => {
    //       return existingProject.name === project.name;
    //     });

    //     if (!isExistingProject) {
    //       this.allProjects.push(project);
    //     }
    //   })
    // });
    this.allProjects = this.selectedClient.projects;
  }


  removeGroupTab(group: group): void {
    //this.clientService.
  }

  handleKeyupEvent(event: KeyboardEvent): void {
    console.log("nothing");
  }

  onBackClicked(): void{
    this.backClicked.emit();
  }

  onCompleteClicked(): void{
    this.completeClicked.emit();
  }

  onEditClicked(selectedClient: client, projectToEdit: project): void{
    this.editClicked.emit({selectedClient, projectToEdit});
  }

  addGroup() {
    const selectedGroupName = this.groupControl.value;
    console.log("selected group name", selectedGroupName);
    if(selectedGroupName){
        const selectedGroup: group | undefined = this.allGroups.find(group => group.groupName === selectedGroupName);
        if (selectedGroup && !this.projectGroups.some(group => group.id === selectedGroup.id)) {
         // this.selectedGroups.push(selectedGroup);
          //remove
          this.projectGroups.push(selectedGroup);
          this.selectedGroupsForm.push(this.formBuilder.control(selectedGroup.id));
          this.allGroups = this.allGroups.filter(group => group.id !== selectedGroup.id);
        }
      }
    this.groupControl.reset();
    this.toggleAddGroupOverlay();

    if(this.projectGroups.length > 0) {
      this.groupSelected = true;
    }
  }

  removeClient(client: client) {
    console.log("client to remove is: ", client);
    this.clientService.deleteClient(client.id).subscribe(
      (response) => {
        console.log('deleted client: ', response);
      }, (error) => {
        console.log('error deleting client', error);
      }
    );
    this.toggleRemoveClientOverlay(null);
  }

  removeProject(project: project) {
    console.log("project to remove: ", project);
  }

  addClient(organisationName: string) {
    const queryParams = { organisation: organisationName };
    this.router.navigate(['/create-account'], { queryParams });
  }

  addProject(organisationName: string) {
    const queryParams = { project: organisationName };
    this.router.navigate(['/create-account'], { queryParams });
  }

  //Overlays
  toggleAddGroupOverlay(){
    this.isAddGroupOverlayOpened = !this.isAddGroupOverlayOpened;
  }

  toggleRemoveClientOverlay(client: client | null){
    if(client != null){
      this.clientToRemove = client;
    }else {
      this.clientToRemove = null;
    }
    this.isRemoveClientOverlayOpened = !this.isRemoveClientOverlayOpened;
  }

  toggleRemoveProjectOverlay(event: Event, project: project | null){
    event.stopPropagation();
    if(project != null){
      this.projectToRemove = project;
    }else {
      this.projectToRemove = null;
    }
    this.isRemoveProjectOverlayOpened = !this.isRemoveProjectOverlayOpened;
  }
}
