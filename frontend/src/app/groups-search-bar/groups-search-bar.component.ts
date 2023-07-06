import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  public filterForm!: FormGroup;
  public isFilterDialogOpen = false;
  public isAddPeopleDialogOpen = false;
  public isCreateGroupDialogOpen = false;

  users: user[] = [];
  groups: group[] = [];
  groupId! : string;


  constructor(private formBuilder: FormBuilder, private groupService: GroupService,private userService: UserService) {
    this.filterForm = this.formBuilder.group({
      name: '',
      surname: '',
      role: 'functional',
      email: ''
    });

  }
  ngOnInit(): void {
    this.createGroupForm = this.formBuilder.group({
      groupName: '',
      // people: this.formBuilder.array([]),
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

    // this.groupId = '11';

    // this.groupService.getUsersByGroupId(this.groupId).subscribe(
    //   (response) => {
    //     this.users = response;
    //     console.log(this.users);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
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
