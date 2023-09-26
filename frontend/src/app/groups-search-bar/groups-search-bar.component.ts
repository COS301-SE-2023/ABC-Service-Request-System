import { Component, EventEmitter, OnInit, Output, Input, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { UserService } from 'src/services/user.service';
import { group } from '../../../../backend/groups/src/models/group.model';
import { user } from "../../../../backend/users/src/models/user.model";
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { NotificationsService } from 'src/services/notifications.service';
import { AuthService } from 'src/services/auth.service';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  filterValue = 'wolongong';
  selectedGroup = '';
  peopleArray: user[] = [];
  @Input() groupName!: string;


  constructor(private formBuilder: FormBuilder, private groupService: GroupService, private userService: UserService, private notificationsService: NotificationsService
    , private authService: AuthService, private eRef: ElementRef, private router: Router,
    private snackBar: MatSnackBar) {
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

    this.openAddPeopleDialogEvent = new EventEmitter(); // Initialize openAddPeopleDialogEvent

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

    this.groupName = 'All Groups'

    // this.fetchGroupsAndUsers();
  }

  // ngOnInit(): void {
  //   this.createGroupForm = this.formBuilder.group({
  //     groupName: ['', Validators.required],
  //     fileInput: ['https://res.cloudinary.com/ds2qotysb/image/upload/v1688755927/ayajgqes9sguidd81qzc.jpg'],
  //     people: ['', Validators.required],
  //   });


  //   this.openAddPeopleDialogEvent.subscribe(() => this.onOpenAddPeopleDialog());

  //   this.addPeopleForm = this.formBuilder.group({
  //     group: ['', Validators.required],
  //     people: ['', Validators.required],
  //   });

  //   this.userService.getAllUsers().subscribe(
  //     response => {
  //       this.users = response;
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   );

  //   this.groupService.getGroups().subscribe((groups: group[]) => {
  //     this.groups = groups;
  //   });

  //   // this.fetchGroupsAndUsers();
  // }
  reload() {
    location.reload();
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
    });
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
    this.openAddPeopleDialog();
  }

  onCreateGroupDialog(): void {
    this.openCreateGroupDialog();
  }

  @Output() groupSelected: EventEmitter<string> = new EventEmitter<string>();

  onGroupSelected(groupId: string): void {
    this.groupSelected.emit(groupId);
    this.selectedGroup = groupId;
  }


  onCreateGroupSubmit(): void {
    if (this.createGroupForm.valid) {
      this.groupService.checkGroupNameExists(this.createGroupForm.value.groupName).subscribe(
        (isExist: boolean) => {
          if (isExist) {
            alert('Group with this name already exists, please select another name');
            // this.groupName = '';
          } else {
            const groupData = {
              ...this.createGroupForm.value,
              people: Array.isArray(this.createGroupForm.value.people) ? this.createGroupForm.value.people : [this.createGroupForm.value.people],
            };
            console.log('group data');
            console.log(groupData);

            if (this.file) {
              this.groupService.uploadFile(this.file!).subscribe(
                (result:any) => {
                  const backgroundPhoto = result.url;
                  console.log('background photo link:' + backgroundPhoto);
                  this.addGroup(groupData, backgroundPhoto);
                  this.closeCreateGroupDialog();
                  this.fetchGroupsAndUsers();
                  this.createGroupForm.reset();
                  // location.reload();
                  this.groupService.getGroups().subscribe((groups: group[]) => {
                    this.groups = groups;
                  });
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
              // this.closeCreateGroupDialog();
              this.fetchGroupsAndUsers();
              this.createGroupForm.reset();
              // location.reload();
              this.groupService.getGroups().subscribe((groups: group[]) => {
                this.groups = groups;
              });
              this.closeAllDialogs();
              this.showSnackBar('Group created!');
            }
          }
        }
      );
    } else {
      this.showValidationAlert();
    }
  }


  async addGroup(groupData: any, backgroundPhoto: string): Promise<void> {
    try {
      groupData.backgroundPhoto = backgroundPhoto;
      console.log('in add group function, ' + groupData.backgroundPhoto);

      const group: any = await this.groupService.createGroup(groupData).toPromise();
      console.log("in addGroup... Group: ", group);

      const people = groupData.people;
      for (let i = 0; i < people.length; i++) {
        const userId: string = people[i];
        try {
          console.log('in component addGroup function... ' + group.id + 'and user is ' + userId);
          await this.userService.addGroupToUser(userId, group.id).toPromise();
          console.log('Group added to user successfully');
          if (i == people.length-1) {
            location.reload();
          }
        } catch (error) {
          console.error('Failed to add group to user', error);
        }
      }

    } catch (error) {
      console.error('Failed to add to group', error);
    }
    const people = groupData.people;
    // Edwin's Notification Code
    for (const userId of people) {
      const tempUser: user | undefined = await this.userService.getUserForNotifications(userId).toPromise();

      if (tempUser !== undefined) {
        console.log("edwin notifcation in");

        const currentUser = this.authService.getUser();

        const profilePhotoLink = currentUser.profilePhoto;
        const notificationMessage = " assigned you to a group";
        const creatorEmail = currentUser.emailAddress;
        const assignedEmail = tempUser.emailAddress;

      //  const groupNotification = await this.groupService.getGroupForNotification(group).toPromise() as group;
      //  this.groupName = groupNotification.groupName;

        const ticketSummary = "Group: " + this.groupName;
        const ticketStatus = "";
        const notificationTime = new Date();
        const link = "";
        const readStatus = "Unread";

        //console.log("About to create notifications");
        await this.notificationsService.newNotification(profilePhotoLink, notificationMessage, creatorEmail, assignedEmail, ticketSummary, ticketStatus, notificationTime, link, readStatus).toPromise();
      }
    }
    // Edwin's Notification Code End ============================
}

  showValidationAlert(): void {
    alert('Please fill out all fields before submitting the form.');
  }

  async onAddPeopleSubmit(): Promise<void> {
    if (this.addPeopleForm.valid) {
      const groupData = {
        ...this.addPeopleForm.value,
        people: Array.isArray(this.addPeopleForm.value.people) ? this.addPeopleForm.value.people : [this.addPeopleForm.value.people],
      };
      const group = groupData.group;
      const people = groupData.people;

      try {
        await this.groupService.addPeopleToGroup(group, people).toPromise();

        await this.groupService.addGroupToUsers(group, people).toPromise();

        this.closeAllDialogs();
        this.showSnackBar('Added to group');

        // Edwin's Notification Code
        for (const userId of people) {
          const tempUser: user | undefined = await this.userService.getUserForNotifications(userId).toPromise();

          if (tempUser !== undefined) {
          //console.log("went in");

          const currentUser = this.authService.getUser();

          const profilePhotoLink = currentUser.profilePhoto;
          const notificationMessage = " assigned you to a group";
          const creatorEmail = currentUser.emailAddress;
          const assignedEmail = tempUser.emailAddress;

          const groupNotification = await this.groupService.getGroupForNotification(group).toPromise() as group;
          this.groupName = groupNotification.groupName;

          const ticketSummary = "Group: " + this.groupName;
          const ticketStatus = "";
          const notificationTime = new Date();
          const link = "";
          const readStatus = "Unread";

          //console.log("About to create notifications");

            await this.notificationsService.newNotification(profilePhotoLink, notificationMessage, creatorEmail, assignedEmail, ticketSummary, ticketStatus, notificationTime, link, readStatus).toPromise();
          }
        }
        // Edwin's Notification Code End ============================

        // console.log('Group added to users successfully');
        // this.closeAddPeopleDialog();
        this.fetchGroupsAndUsers();
        this.addPeopleForm.reset();
        // location.reload();
      } catch (error) {
        console.error('Error:', error);
      }
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
    // this.filterValue = filterValue;
    this.groupName = 'All Groups'
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
