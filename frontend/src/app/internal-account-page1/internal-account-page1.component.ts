import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { GroupService } from 'src/services/group.service';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { group } from '../../../../backend/groups/src/models/group.model';
import { user } from "../../../../backend/users/src/models/user.model";

@Component({
  selector: 'app-internal-account-page1',
  templateUrl: './internal-account-page1.component.html',
  styleUrls: ['./internal-account-page1.component.scss']
})
export class InternalAccountPage1Component implements OnInit{
  @Output() completeClicked = new EventEmitter<void>();
  @Output() userCreated: EventEmitter<any> = new EventEmitter<any>();

  createUserForm: FormGroup;
  errorMessage!: string;
  groupControl = new FormControl('');
  allGroups: group[] = [];
  selectedGroups: group[] = [];
  allGroupIds: string[] = [];
  selectedGroupsForm: FormArray;
  filteredOptions!: Observable<string[]>;
  isAddGroupOverlayOpened = false;
  groupSelected = false;

  constructor(public authService: AuthService, private formBuilder: FormBuilder, private router: Router, private groupService: GroupService) {
    this.selectedGroupsForm = this.formBuilder.array([]);

    this.createUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      manager: false,
      technical: false,
      functional: false,
      selectedGroups: this.selectedGroupsForm,
    });
  }

  ngOnInit() {
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

  async onSubmit() {
    console.log('Form value:', this.createUserForm.value);

    if (!this.createUserForm.valid) {
      console.log('Form is not valid');
      return;
    }

    const formData = this.createUserForm.value;

    try {
      console.log('Creating user:', formData);
      const response: any = await this.authService.createUser(formData).toPromise();
      console.log('User created successfully');

      if (response && response.message === 'User created successfully') {
        console.log("user: ", response.user);

        this.selectedGroups.forEach(group => {
          console.log('printing');
          this.groupService.addPeopleToGroup(group, response.user).subscribe(
            (responded: any) => {
              console.log('subscribe', responded);
            },
            (errors: any) => {
              console.log("Failed to add people", errors);
            }
          );
        });

        this.completeClicked.emit();
        this.userCreated.emit(response.user);
        //this.router.navigate(['/dashboard']);
      } else {
        console.error('Error creating user:', response);
        this.errorMessage = 'Error creating user. Please try again.';
      }
    } catch (error) {
      console.error('Error creating user:', error);
      this.errorMessage = 'Error creating user. Please try again.';
    }
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

  handleKeyupEvent(event: KeyboardEvent): void {
    console.log("nothing");
  }

  onCompleteClicked(): void{
    console.log('create clicked');
  }

  //Overlays
  toggleAddGroupOverlay(){
    console.log(this.isAddGroupOverlayOpened);
    this.isAddGroupOverlayOpened = !this.isAddGroupOverlayOpened;
  }
}

