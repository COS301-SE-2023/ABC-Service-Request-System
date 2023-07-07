import { Component, EventEmitter, OnInit, Output, Input, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { UserService } from 'src/services/user.service';
import { group } from '../../../../backend/src/models/group.model'
import { user } from '../../../../backend/src/models/user.model'
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';

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
  selectedGroup = '';



  constructor(private formBuilder: FormBuilder, private groupService: GroupService,private userService: UserService
    , private eRef: ElementRef, private router: Router) {
    this.filterForm = this.formBuilder.group({
      name: '',
      surname: '',
      role: 'functional',
      email: ''
    });
  }

  @Input() openAddPeopleDialogEvent!: EventEmitter<void>;

  defaultImage = 'https://res.cloudinary.com/ds2qotysb/image/upload/v1688755927/ayajgqes9sguidd81qzc.jpg';
  ngOnInit(): void {
    this.createGroupForm = this.formBuilder.group({
      groupName: ['', Validators.required],
      fileInput: ['https://res.cloudinary.com/ds2qotysb/image/upload/v1688755927/ayajgqes9sguidd81qzc.jpg'],
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
    this.selectedGroup = groupId;
  }


  onCreateGroupSubmit(): void {
    if (this.createGroupForm.valid) {
      const groupData = {
        ...this.createGroupForm.value,
        people: Array.isArray(this.createGroupForm.value.people) ? this.createGroupForm.value.people : [this.createGroupForm.value.people],
      };
      console.log(groupData);
      // console.log('Selected File:', this.file);

      if (this.file) {
        this.groupService.uploadFile(this.file!).subscribe(
          (result:any) => {
            const backgroundPhoto = result.url;
            console.log('background photo link:' + backgroundPhoto);
            this.addGroup(groupData, backgroundPhoto);
            this.closeCreateGroupDialog();
            this.fetchGroupsAndUsers();
            this.createGroupForm.reset();
          },
          (error: any) => {
            console.log('Error uploading file', error);
          }
        )
      }
      else if (!this.file) {
        const backgroundPhoto = 'https://res.cloudinary.com/ds2qotysb/image/upload/v1688755927/ayajgqes9sguidd81qzc.jpg';
        console.log('background photo link:' + backgroundPhoto);
        this.addGroup(groupData, backgroundPhoto);
        this.closeCreateGroupDialog();
        this.fetchGroupsAndUsers();
        this.createGroupForm.reset();
      }
    } else {
      this.showValidationAlert();
    }
  }

  addGroup(groupData: any, backgroundPhoto: string): void {
    groupData.backgroundPhoto = backgroundPhoto;
    console.log('in add group function, ' + groupData.backgroundPhoto);
    this.groupService.createGroup(groupData);
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

  file: File | null = null;
  preview: SafeUrl | null = null;
  onFileChange(event: any) {
    const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
    this.file = file as File | null;

    console.log('file name' + file.name);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.preview = reader.result as SafeUrl;
      };
      reader.readAsDataURL(file);
    } else {
      this.preview = 'https://res.cloudinary.com/ds2qotysb/image/upload/v1688755927/ayajgqes9sguidd81qzc.jpg';
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
    if (filterValue === 'all') {
      this.selectedGroup = '';
    }
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

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.createGroupForm.patchValue({
          groupImage: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  }

}
