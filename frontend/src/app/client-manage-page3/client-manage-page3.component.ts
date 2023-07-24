import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { client, project } from '../../../../backend/clients/src/models/client.model';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { group } from '../../../../backend/groups/src/models/group.model';
import { GroupService } from 'src/services/group.service';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ticket } from "../../../../backend/tickets/src/models/ticket.model";
import { ClientService } from 'src/services/client.service';


@Component({
  selector: 'app-client-manage-page3',
  templateUrl: './client-manage-page3.component.html',
  styleUrls: ['./client-manage-page3.component.scss']
})
export class ClientManagePage3Component implements OnInit{
  @Output() backClicked = new EventEmitter<void>();
  @Output() completeClicked = new EventEmitter<void>();

  @Input() projectToEdit!: project;

  hovered = false;

  isLogosOverlayOpen = false;
  projectImageUrl!: string;
  projectImageColor!: string;
  isAddGroupOverlayOpened = false;

  groupControl = new FormControl('');
  groupSelected = false;
  allGroups: group[] = [];
  selectedGroups: group[] = [];
  removingGroups: group[] = [];
  selectedGroupsForm: FormArray;
  filteredOptions!: Observable<string[]>;

  allTickets: ticket[] = [];
  existingGroups: group[] = [];
  clientToEdit!: client;

  constructor(private router: Router,
      private formBuilder: FormBuilder,
      private groupService: GroupService,
      private clientService: ClientService) {
    this.selectedGroupsForm = this.formBuilder.array([]);
  }

  ngOnInit(): void {
    if (this.projectToEdit) {
      this.removingGroups = [];
      this.selectedGroups = [];

      this.projectImageUrl = this.projectToEdit.logo;
      this.projectImageColor = this.projectToEdit.color;

      // GETTING ALL THE GROUPS
      this.groupService.getGroups().subscribe(
        (result: group[]) => {
          result.forEach(item => {
            this.allGroups.push(item);
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

      // GETTING EXISTING GROUPS BELONGING TO THIS PROJECT
      //GET GROUP INFO AGAIN TO MAKE SURE CORRECT VALUES
      // if(this.projectToEdit){
      //   this.clientService.getProjectByProjectIdAndClienId(this.projectToEdit.id, this.clientToEdit.id).subscribe(
      //     (response) => {
      //       console.log('got new project');
      //       this.projectToEdit = response;
      //     }
      //   )
      // }

      if(this.projectToEdit){
        this.clientService.getProjectByObjectId(this.projectToEdit._id!).subscribe(
          (response) => {
            console.log("response project to edit: ", response.project[0]);
            this.projectToEdit = response.project[0];

            if (this.projectToEdit.assignedGroups && this.projectToEdit.assignedGroups.length > 0) {
              console.log("init groups: ", this.projectToEdit.assignedGroups.slice());
              this.existingGroups = this.projectToEdit.assignedGroups.slice();
              this.selectedGroups = this.projectToEdit.assignedGroups.slice();
              this.groupSelected = true;

              // REMOVE EXISTING GROUPS FROM ALL GROUPS
              this.filteredOptions = this.groupControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value || '')),
              );
            }
          }
        )
      }

      const encodedProjectName = encodeURIComponent(this.projectToEdit.name);

      this.clientService.getClientByProjectName(encodedProjectName).subscribe(
        (response) => {
          this.clientToEdit = response;
        }, (error) => {
          console.log("Error fetching client by project name", error);
        }
      );
    }
  }


  // ngOnInit(): void {
  //   this.projectImageUrl = this.projectToEdit.logo;
  //   this.projectImageColor = this.projectToEdit.color;

  //    //GETTING ALL THE GROUPS
  //    this.groupService.getGroups().subscribe(
  //     (result: group[]) => {
  //       result.forEach(item => {
  //         this.allGroups.push(item);
  //       });
  //     },
  //     (error: any) => {
  //       console.log('Error fetching all groups', error);
  //     }
  //   );

  //   this.filteredOptions = this.groupControl.valueChanges.pipe(
  //     startWith(''),
  //     map(value => this._filter(value || '')),
  //   );

  //   //GETTING EXISTING GROUPS BELONGING TO THIS PROJECT
  //   if(this.projectToEdit.assignedGroups && this.projectToEdit.assignedGroups.length > 0){
  //     this.existingGroups = this.projectToEdit.assignedGroups.slice();
  //     this.selectedGroups = this.projectToEdit.assignedGroups.slice();
  //     this.groupSelected = true;

  //     //REMOVE EXISTING GROUPS FROM ALL GROUPS
  //     this.filteredOptions = this.groupControl.valueChanges.pipe(
  //       startWith(''),
  //       map(value => this._filter(value || '')),
  //     );
  //   }

  //   const encodedProjectName = encodeURIComponent(this.projectToEdit.name);

  //   this.clientService.getClientByProjectName(encodedProjectName).subscribe(
  //     (response) => {
  //       this.clientToEdit = response;
  //     }, (error) => {
  //       console.log("Error fetching client by project name", error);
  //     }
  //   )
  // }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allGroups
      .filter(option => option.groupName.toLowerCase().includes(filterValue) && !this.selectedGroups.some(selectedGroup => selectedGroup.id === option.id))
      .map(option => option.groupName);
  }


  toggleHover(){
    this.hovered = !this.hovered;
  }

  onBackClicked(): void{
    this.backClicked.emit();
  }

  onUpdateAndBack() {
    console.log("selected groups: ", this.selectedGroups);
    this.selectedGroups = this.selectedGroups.filter(group => !this.existingGroups.includes(group));

    this.clientService.addGroupsToProject(this.clientToEdit.id, this.projectToEdit.id, this.selectedGroups).subscribe(
      (response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      }
    )

    const removingGroupsNames: string [] = [];

    this.removingGroups.forEach(group => {
      removingGroupsNames.push(group.groupName);
    });

    console.log('removing groups is:', this.removingGroups);
    this.clientService.removeGroupFromProject(this.clientToEdit.id, this.projectToEdit.id, removingGroupsNames).subscribe(
      (respone) => {
        console.log('group removed', respone);
      }
    )
    // this.removingGroups.forEach(group => {
    //   console.log("about to remove: ", group);
    //   this.clientService.removeGroupFromProject(this.clientToEdit.id, this.projectToEdit.id, group.groupName).subscribe(
    //     (response) => {
    //       console.log('group removed: ', response)
    //       this.removingGroups = [];
    //     }
    //   );
    // })

    this.selectedGroups = [];
    this.backClicked.emit();
  }

  addGroup() {
    const selectedGroupName = this.groupControl.value;
    if(selectedGroupName){
        const selectedGroup: group | undefined = this.allGroups.find(group => group.groupName === selectedGroupName);
        if (selectedGroup && !this.selectedGroups.some(group => group.id === selectedGroup.id)) {
          this.selectedGroups.push(selectedGroup);
          this.selectedGroupsForm.push(this.formBuilder.control(selectedGroup.id));
          this.allGroups = this.allGroups.filter(group => group.id !== selectedGroup.id);
        }
      }
    this.groupControl.reset();
    this.toggleAddGroupOverlay();

    if(this.selectedGroups.length > 0) {
      this.groupSelected = true;
    }
  }

  handleKeyupEvent(event: KeyboardEvent): void {
    console.log("nothing");
  }

  removeGroupTab(event: MouseEvent, index: number): void {
    const targetElement = event.target as HTMLElement;
    const groupTabElement = targetElement.closest('.group-tab');
    if (groupTabElement) {
      const groupNameElement = groupTabElement.querySelector('p');
      if (groupNameElement) {
        const groupName = groupNameElement.textContent;
        if (groupName) {
          const selectedGroupIndex = this.selectedGroups.findIndex(group => group.groupName === groupName);
          if (selectedGroupIndex !== -1) {
            const selectedGroup = this.selectedGroups[selectedGroupIndex];

            const isGroupInRemovingGroups = this.removingGroups.some((group) => group.groupName === selectedGroup.groupName);

            if (!isGroupInRemovingGroups) {
              this.removingGroups.push(selectedGroup);
            }

            this.selectedGroups.splice(selectedGroupIndex, 1);
            this.selectedGroupsForm.removeAt(index);
            this.allGroups.push(selectedGroup);
          }
        }
      }
      groupTabElement.remove();
    }
  }

  //Overlays
  toggleAddGroupOverlay(){
    this.isAddGroupOverlayOpened = !this.isAddGroupOverlayOpened;
  }

  toggleLogosOverlay() {
    this.isLogosOverlayOpen = !this.isLogosOverlayOpen;
  }

  setProjectLogo(event: MouseEvent) {
    const buttonElement = event.currentTarget as HTMLButtonElement;
    const imgElement = buttonElement.querySelector('img') as HTMLImageElement;
    this.projectImageUrl = imgElement.src;
    this.projectImageColor = imgElement.className;
  }
}
