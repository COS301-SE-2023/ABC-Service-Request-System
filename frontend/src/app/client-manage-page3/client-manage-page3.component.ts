import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { client, project } from '../../../../backend/src/models/client.model';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { group } from '../../../../backend/src/models/group.model';
import { GroupService } from 'src/services/group.service';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';


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

  constructor(private router: Router, private formBuilder: FormBuilder, private groupService: GroupService) {
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
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allGroups
    .filter(option => option.groupName.toLowerCase().includes(filterValue))
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
    this.router.navigate(['/dashboard']);
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
