import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { client, project } from '../../../../backend/src/models/client.model';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { group } from '../../../../backend/src/models/group.model';
import { GroupService } from 'src/services/group.service';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ticket } from '../../../../backend/src/models/ticket.model';
import { ClientService } from 'src/services/client.service';


@Component({
  selector: 'app-client-manage-page3',
  templateUrl: './client-manage-page3.component.html',
  styleUrls: ['./client-manage-page3.component.scss']
})
export class ClientManagePage3Component implements OnInit{
  @Output() backClicked = new EventEmitter<void>();
  @Output() completeClicked = new EventEmitter<void>();

  @Input() clientToEdit!: client;
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
  selectedGroupsForm: FormArray;
  filteredOptions!: Observable<string[]>;

  allTickets: ticket[] = [];
  existingGroups: group[] = [];

  constructor(private router: Router,
      private formBuilder: FormBuilder,
      private groupService: GroupService,
      private clientService: ClientService) {
    this.selectedGroupsForm = this.formBuilder.array([]);
  }

  ngOnInit(): void {
    this.projectImageUrl = this.projectToEdit.logo;
    this.projectImageColor = this.projectToEdit.color;

     //GETTING ALL THE GROUPS
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

    //GETTING EXISTING GROUPS BELONGING TO THIS PROJECT
    if(this.projectToEdit.assignedGroups && this.projectToEdit.assignedGroups.length > 0){
      this.existingGroups = this.projectToEdit.assignedGroups;
      this.selectedGroups = this.projectToEdit.assignedGroups;
      this.groupSelected = true;

      //REMOVE EXISTING GROUPS FROM ALL GROUPS
      this.filteredOptions = this.groupControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
    }

    console.log("selected groups: ", this.selectedGroups);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allGroups
      .filter(option => option.groupName.toLowerCase().includes(filterValue) && !this.selectedGroups.some(selectedGroup => selectedGroup.id === option.id))
      .map(option => option.groupName);
  }


  toggleHover(){
    console.log('came in');
    this.hovered = !this.hovered;
  }

  onBackClicked(): void{
    this.backClicked.emit();
  }

  navigateToDashboard() {
    console.log('selected Groups before:', this.selectedGroups);
    console.log('existing groups: ', this.existingGroups);
    this.selectedGroups = this.selectedGroups.filter(group => !this.existingGroups.includes(group));
    console.log('selected Groups now:', this.selectedGroups);
    this.selectedGroups.forEach((group) => {
      console.log("group 1: ", group);
      this.clientService.addGroupToProject(this.clientToEdit.id, this.projectToEdit.id, group).subscribe(
        (response) => {
          console.log(response, ' hi');
        }, (error) => {
          console.log(error, ' bye');
        }
      )
    })
    //this.router.navigate(['/dashboard']);
  }

  addGroup() {
    const selectedGroupName = this.groupControl.value;
    console.log("selected group name", selectedGroupName);
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
