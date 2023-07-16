import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { GroupService } from 'src/services/group.service';
import { AuthService } from 'src/services/auth.service';
import { ClientService } from 'src/services/client.service';

import { group } from '../../../../backend/src/models/group.model';
import { client } from '../../../../backend/src/models/client.model';

@Component({
  selector: 'app-client-account-page3',
  templateUrl: './client-account-page3.component.html',
  styleUrls: ['./client-account-page3.component.scss']
})
export class ClientAccountPage3Component implements OnInit{
  @Output() backClicked = new EventEmitter<void>();
  @Output() completeClicked = new EventEmitter<void>();
  @Output() clientCreated: EventEmitter<any> = new EventEmitter<any>();

  @Input() formData: any;

  projectImageUrl!: string;
  projectImageColor!: string;
  isLogosOverlayOpen = false;

  isAddGroupOverlayOpened = false;
  groupControl = new FormControl('');
  filteredOptions!: Observable<string[]>;
  allGroups: group[] = [];
  selectedGroups: group[] = [];
  selectedGroupsForm: FormArray;
  groupSelected = false;

  createdClient!: client;

  hovered = false;

  constructor (
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private groupService: GroupService,
    private clientService: ClientService) {
    this.selectedGroupsForm = this.formBuilder.array([]);
  }

  toggleHover(){
    this.hovered = !this.hovered;
  }

  // removeGroupTab(event: MouseEvent): void {
  //   const targetElement = event.target as HTMLElement;
  //   const groupTabElement = targetElement.closest('.group-tab');
  //   if (groupTabElement) {
  //     groupTabElement.remove();
  //   }
  // }

  ngOnInit(): void {
    this.formData.projectName = 'Untitled';
    this.setRandomImage();

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

  handleKeyupEvent(event: KeyboardEvent): void {
    console.log("nothing");
  }

  onBackClicked(): void{
    this.backClicked.emit();
  }

  onCompleteClicked(): void{
    console.log(this.projectImageUrl, this.projectImageColor, this.selectedGroups);
    this.formData.logo = this.projectImageUrl;
    this.formData.color = this.projectImageColor;
    this.formData.groups = this.selectedGroups;

    console.log(this.formData);

    this.clientService.createClient(this.formData).subscribe(
      (response) => {
        console.log('Response:', response);
        this.createdClient = response.client;
        this.clientCreated.emit(this.createdClient); //emit the created client to use on page 4
        this.completeClicked.emit();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  setRandomImage(): void {
    const imageFolder = '../../assets/project-logos/';
    const imageNames = ['camera.png', 'coffee-cup.png', 'computer.png', 'eight.png', 'flask.png', 'hotdog.png', 'laptop.png', 'notebook.png', 'smartphone.png', 'vynil.png', 'wallet.png', 'web-design.png'];
    const imageColors = ['orange-cl', 'cyan-cl', 'yellow-cl', 'grey-cl', 'purple-cl', 'green-cl', 'blue-cl', 'pink-cl', 'yellow-cl', 'orange-cl', 'cyan-cl', 'purple-cl'];

    const randomIndex = Math.floor(Math.random() * imageNames.length);
    const randomImageName = imageNames[randomIndex];

    this.projectImageUrl = imageFolder + randomImageName;
    this.projectImageColor = imageColors[randomIndex];
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

  //Overlays
  toggleAddGroupOverlay(){
    console.log(this.isAddGroupOverlayOpened);
    this.isAddGroupOverlayOpened = !this.isAddGroupOverlayOpened;
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
            this.selectedGroups.splice(selectedGroupIndex, 1);
            this.selectedGroupsForm.removeAt(index);
            this.allGroups.push(selectedGroup);
          }
        }
      }
      groupTabElement.remove();
    }

    if(this.selectedGroups.length == 0) {
      this.groupSelected = false;
    }
  }
}
