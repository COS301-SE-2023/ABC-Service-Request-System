import { Component, EventEmitter, OnInit, Output, Input, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { UserService } from 'src/services/user.service';
import { group } from '../../../../backend/src/models/group.model'
import { user } from '../../../../backend/src/models/user.model'
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-groups-search-bar',
  templateUrl: './groups-search-bar.component.html',
  styleUrls: ['./groups-search-bar.component.scss']
})
export class GroupsSearchBarComponent implements OnInit {
  public createGroupForm!: FormGroup;
  public addPeopleForm!: FormGroup;

  public filterForm!: FormGroup;
  public isFilterDialogOpen = false;
  public isAddPeopleDialogOpen = false;
  public isCreateGroupDialogOpen = false;

  users: user[] = [];
  groups: group[] = [];
  groupId! : string;
  filterValue = 'all';


  constructor(private formBuilder: FormBuilder, private groupService: GroupService,private userService: UserService
    , private eRef: ElementRef, private router: Router) {
    this.filterForm = this.formBuilder.group({
      name: '',
      surname: '',
      role: 'functional',
      email: ''
    });

    this.addPeopleForm = this.formBuilder.group({
      group: [null],
      people: [null],
    });

  }

  @Input() openAddPeopleDialogEvent!: EventEmitter<void>;


  ngOnInit(): void {
    this.createGroupForm = this.formBuilder.group({
      groupName: ['', Validators.required],
      people: ['', Validators.required],
    });

    this.openAddPeopleDialogEvent.subscribe(() => this.onOpenAddPeopleDialog());

    this.addPeopleForm = this.formBuilder.group({
      group: ['', Validators.required],
      people: ['', Validators.required],
    });

    this.userService.getAllUsers().subscribe(
      response => {
        this.users = response;
      },
      error => {
        console.log(error);
      }
    );

    this.groupService.getGroups().subscribe((groups: group[]) => {
      this.groups = groups;
    });

    this.fetchGroupsAndUsers();
  }

  closeAllDialogs() {
    this.isFilterDialogOpen = false;
    this.isAddPeopleDialogOpen = false;
    this.isCreateGroupDialogOpen = false;
  }

  navigateToCreateAccount() {
    this.router.navigateByUrl('/create-account');
  }

  onOpenAddPeopleDialog(): void {
    console.log('[][][]2');
    this.openAddPeopleDialog();
  }

  @Output() groupSelected: EventEmitter<string> = new EventEmitter<string>();

  onGroupSelected(groupId: string): void {
    this.groupSelected.emit(groupId);
  }


  onCreateGroupSubmit(): void {
    if (this.createGroupForm.valid) {
      const groupData = {
        ...this.createGroupForm.value,
        people: Array.isArray(this.createGroupForm.value.people) ? this.createGroupForm.value.people : [this.createGroupForm.value.people],
      };
      this.groupService.createGroup(groupData)
        .subscribe(
          response => {
            // console.log(response);
            this.closeCreateGroupDialog();
            this.createGroupForm.reset();
          },
          error => {
            console.log(error);
          });
    } else {
      this.showValidationAlert();
    }
  }

  showValidationAlert(): void {
    alert('Please fill out all fields before submitting the form.');
  }

  onAddPeopleSubmit():void {
    if (this.addPeopleForm.valid) {
      const groupData = {
        ...this.addPeopleForm.value,
        people: Array.isArray(this.addPeopleForm.value.people) ? this.addPeopleForm.value.people : [this.addPeopleForm.value.people],
      };
      console.log('hello from frontend' + groupData);
      const group = groupData.group;
      const people = groupData.people;
      this.groupService.addPeopleToGroup(group,people).subscribe(
        response => {
          this.closeAddPeopleDialog();
          this.fetchGroupsAndUsers();
          this.addPeopleForm.reset();
        },
        error => {
          console.log(error);
        }
      )
    } else {
      this.showValidationAlert();
    }
  }

  fetchGroupsAndUsers(): void {
  this.userService.getAllUsers().subscribe(
    response => {
      this.users = response;
    },
    error => {
      console.log(error);
    }
  );

  this.groupService.getGroups().subscribe((groups: group[]) => {
    this.groups = groups;
  });
}

  @Output() filterChanged: EventEmitter<string> = new EventEmitter<string>();

  handleFilterChange(filterValue: string): void {
    this.filterChanged.emit(filterValue);
    this.filterValue = filterValue;
  }

  openFilterDialog() {
    this.isFilterDialogOpen = true;
  }

  closeFilterDialog() {
    this.isFilterDialogOpen = false;
  }

  openAddPeopleDialog() {
    console.log('[][][]3');
    this.isAddPeopleDialogOpen = true;
    console.log('[][][]4');
  }

  closeAddPeopleDialog() {
    this.isAddPeopleDialogOpen = false;
  }

  openCreateGroupDialog() {
    this.isCreateGroupDialogOpen = true;
  }

  closeCreateGroupDialog() {
    this.isCreateGroupDialogOpen = false;
  }

  resetFields() {
    this.filterForm.reset();
    Object.keys(this.filterForm.controls).forEach((key: string) => {
      this.filterForm.get(key)?.markAsUntouched();
    });
  }
}
