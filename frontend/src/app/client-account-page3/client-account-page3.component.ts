import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { GroupService } from 'src/services/group.service';
import { AuthService } from 'src/services/auth.service';
import { ClientService } from 'src/services/client.service';
import { group } from '../../../../backend/groups/src/models/group.model';
import { client } from '../../../../backend/clients/src/models/client.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client-account-page3',
  templateUrl: './client-account-page3.component.html',
  styleUrls: ['./client-account-page3.component.scss']
})
export class ClientAccountPage3Component implements OnInit{
  @Output() backClicked = new EventEmitter<number>();
  @Output() completeClicked = new EventEmitter<void>();
  @Output() clientCreated: EventEmitter<any> = new EventEmitter<any>();

  @Input() formData: any;
  @Input() selectedOrganisation!: string;

  availableClients: client[] = [];

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

  groupNumberError = false;

  createdClient!: client;

  hovered = false;

  selectedClient!: client;

  low = 'Low';
  medium = 'Medium';
  high = 'High';

  constructor (
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private groupService: GroupService,
    private clientService: ClientService,
    private snackBar: MatSnackBar) {
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

    if (!this.formData || !this.formData.projectName) {
      this.formData = {
        ...this.formData,
        projectName: 'Untitled',
        logo: '',
        color: '',
        groups: []
      };
    }

    console.log("selected org: ", this.selectedOrganisation);

    if(this.selectedOrganisation) {
      console.log("selected org: ", this.selectedOrganisation);
      this.clientService.getClientsByOrganisationName(this.selectedOrganisation).subscribe(
        (response) => {
          this.availableClients = response;
          console.log("available clients: ", response);
          this.selectedClient = this.availableClients[0];
        }, (error) => {
          console.log("Error fetching clients with organisation name", error);
        }
      )
    }

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

  onSelectionChange(): void {
    console.log(this.selectedClient, ' change');
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
    if(this.selectedOrganisation !== undefined)
      this.backClicked.emit(5);
    else
      this.backClicked.emit(1);
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
    });
  }

  validatePriority(priority: string): boolean {
    const pattern = /^[0-9]+[wdhm]$/;
    return pattern.test(priority);
  }

  lowPriority = '';
  mediumPriority = '';
  highPriority = '';
  onCompleteClicked(): void{

    if(this.selectedGroups.length < 1) {
      this.groupNumberError = true;
      return;
    }

    if(this.selectedOrganisation !== undefined) {
      let isValid = true;
      if (!this.validatePriority(this.lowPriority)) {
        isValid = false;
        this.showSnackBar('Invalid format in Low Priority');
      }

      if (!this.validatePriority(this.mediumPriority)) {
        isValid = false;
        this.showSnackBar('Invalid format in Medium Priority');
      }

      if (!this.validatePriority(this.highPriority)) {
        isValid = false;
        this.showSnackBar('Invalid format in High Priority');
      }

      if (isValid) {
        console.log('All priorities adhere to the format.');
        const priorities = [this.lowPriority, this.mediumPriority, this.highPriority];

        if (priorities.every(priority => priorities.filter(p => p.endsWith(priority.slice(-1))).length === 1)) {
          console.log('Each priority has only one unit.');
        } else {
          this.showSnackBar('Each priority should have only one unit');
        }
      }

      this.formData = {
        ...this.formData,
        logo: this.projectImageUrl,
        color: this.projectImageColor,
        groups: this.selectedGroups,
        clientId: this.selectedClient.id,
        lowPriorityTime: this.lowPriority,
        mediumPriorityTime: this.mediumPriority,
        highPriorityTime: this.highPriority,
      }

      // console.log(this.formData, ' form-data');
      if (isValid) {
        this.clientService.addProject(this.formData).subscribe(
          (response) => {
            // console.log('Response: ', response);
            this.createdClient = response;
            this.clientCreated.emit(this.createdClient);
            this.completeClicked.emit();
          },
          (error) => {
            console.error('Error:', error);
          }
        );
      }
    } else {
      console.log(this.projectImageUrl, this.projectImageColor, this.selectedGroups);
      this.formData.logo = this.projectImageUrl;
      this.formData.color = this.projectImageColor;
      this.formData.groups = this.selectedGroups;
      this.formData.lowPriorityTime = this.lowPriority;
      this.formData.mediumPriorityTime = this.mediumPriority;
      this.formData.highPriorityTime = this.highPriority;

      console.log(this.formData);
      console.log('heloooooo');
      console.log('Low Priority:', this.lowPriority);
      console.log('Medium Priority:', this.mediumPriority);
      console.log('High Priority:', this.highPriority);

      let isValid = true;
      if (!this.validatePriority(this.lowPriority)) {
        isValid = false;
        this.showSnackBar('Invalid format in Low Priority');
      }

      if (!this.validatePriority(this.mediumPriority)) {
        isValid = false;
        this.showSnackBar('Invalid format in Medium Priority');
      }

      if (!this.validatePriority(this.highPriority)) {
        isValid = false;
        this.showSnackBar('Invalid format in High Priority');
      }

      if (isValid) {
        console.log('All priorities adhere to the format.');
        const priorities = [this.lowPriority, this.mediumPriority, this.highPriority];

        if (priorities.every(priority => priorities.filter(p => p.endsWith(priority.slice(-1))).length === 1)) {
          console.log('Each priority has only one unit.');
        } else {
          this.showSnackBar('Each priority should have only one unit');
        }
      }

      if (isValid) {
        this.clientService.createClient(this.formData).subscribe(
          (response) => {
            // console.log('Response:', response);
            this.createdClient = response.client;
            this.clientCreated.emit(this.createdClient);
            this.completeClicked.emit();
          },
          (error) => {
            console.error('Error:', error);
          }
        );
      }
    }
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
          this.groupNumberError = false;
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
