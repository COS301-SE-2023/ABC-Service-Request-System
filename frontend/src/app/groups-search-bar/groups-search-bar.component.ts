import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { UserService } from 'src/services/user.service';
import { group } from '../../../../backend/src/models/group.model'
import { user } from '../../../../backend/src/models/user.model'

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


  constructor(private formBuilder: FormBuilder, private groupService: GroupService,private userService: UserService) {
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
      groupName: '',
      // people: this.formBuilder.array([]),
      people: '',
    });

    this.openAddPeopleDialogEvent.subscribe(() => this.onOpenAddPeopleDialog());

    this.addPeopleForm = this.formBuilder.group({
      group: '',
      people: '',
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
  }

  onOpenAddPeopleDialog(): void {
    this.isAddPeopleDialogOpen = true;
  }

  @Output() groupSelected: EventEmitter<string> = new EventEmitter<string>();

  onGroupSelected(groupId: string): void {
    this.groupSelected.emit(groupId);
  }

  onSubmit(): void {
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
          },
          error => {
            console.log(error);
          });
    }


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
    this.isAddPeopleDialogOpen = true;
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
