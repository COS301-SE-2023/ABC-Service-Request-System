/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tickets } from '../data';
import { Subscription } from 'rxjs';
import { TicketsService } from 'src/services/ticket.service';
import { AuthService } from 'src/services/auth.service';
import { ticket, attachment, comment, worklog, history } from '../../../../backend/tickets/src/models/ticket.model';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { user } from "../../../../backend/users/src/models/user.model";
import { NavbarService } from 'src/services/navbar.service';
import { NotificationsService } from 'src/services/notifications.service';
import { tick } from '@angular/core/testing';
// import { history } from '../../../../backend/tickets/src/models/ticket.model';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss'],
})

export class TicketDetailComponent implements OnInit, OnDestroy {



  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ticketService: TicketsService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private notificationsService: NotificationsService,
    private navbarService: NavbarService,
    private router: Router) {

    }

  ticket!: ticket;
  ticketPanelOpenState = false;
  SLAPanelOpenState = true;
  detailsPanelOpenState = true;
  private routeSubscription: Subscription = new Subscription();
  commentInputControl = new FormControl('');
  textareaValue = '';
  navbarIsCollapsed!: boolean;

  userProfilePic!: string;

  file: File | null = null;
  selectedStatus = '';
  preview: SafeUrl | null = null;
  attachment: attachment | null = null;
  editedAttachmentName: string | null = null;

  uploadProgress = 0;
  attachmentsOnly = false;
  commentsOnly = false;
  historyOnly = false;
  allComments = false;

  userId !: string;

  assigneeUser!: user;
  assigneeImage!: string;
  assigneeName!:string;
  assignedGroup!:string;
  currentAssigned!:string;

  checkChanges = false;

  todosChanged: boolean[] = [];
  numReversed = 0;
  numReversedHistory = 0;

  isFormVisible = false;
  description = '';
  workLogForm!: FormGroup;

  workLogsOnly = false;

  activeTab = 'All';
  lowPriority = false;
  medPriority=false;
  highPriority=false;

  timeToFirstResponse = 'pending';
  timeToTicketResolution = 'pending';


  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  cancel() {
    this.isFormVisible = false;
  }

  userSelected(event: any) {

    this.numReversedHistory = 0;
    this.showHistoryOnly();
    // this.highlightHistoryButton('event');
  }


  onSubmit() {
    this.activeTab = 'Work Logs';

    if (this.workLogForm.valid) {
        // Parse out HTML tags from the 'description' field
        const parsedHtml = new DOMParser().parseFromString(this.workLogForm.value.description, 'text/html');
        const textContent = parsedHtml.body.textContent || "";
        this.workLogForm.get('description')!.setValue(textContent);

        let currentUser!: user;

        this.authService.getUserObject().subscribe(
            (response) => {
                currentUser = response;

                console.log('currentUser.profilePhoto:', currentUser.profilePhoto);
                const workLog: worklog = {
                    author: currentUser.name,
                    authorPhoto: currentUser.profilePhoto,
                    ...this.workLogForm.value
                };

                console.log('workLog', workLog);
                this.ticketService.addWorkLogToTicket(this.ticket.id, workLog)
                    .subscribe(response => {
                        this.ticket = response;
                        this.toggleForm(); // to close the form after submission

                        // Update work logs display right after successfully adding a work log
                        this.showWorkLogs();

                        // Consider adding a message or a toast notification here to inform the user of successful submission.
                    }, error => {
                        // Handle errors. For instance, show an error message to the user.
                        console.error("There was an error submitting the form:", error);
                    });
            }, (error) => { console.log("error fetching current user ") }
        );
    }
}


//   onSubmit() {
//     this.activeTab = 'Work Logs';
//     if (this.workLogForm.valid) {
//         // Parse out HTML tags from the 'description' field
//         const parsedHtml = new DOMParser().parseFromString(this.workLogForm.value.description, 'text/html');
//         const textContent = parsedHtml.body.textContent || "";
//         this.workLogForm.get('description')!.setValue(textContent);

//         let currentUser!: user;

//         this.authService.getUserObject().subscribe(
//             (response) => {
//                 currentUser = response;

//                 console.log('currentUser.profilePhoto:', currentUser.profilePhoto);
//                 const workLog: worklog = {
//                     author: currentUser.name,
//                     authorPhoto: currentUser.profilePhoto, // Use the email address as the author
//                     ...this.workLogForm.value
//                 };

//                 console.log('workLog', workLog);
//                 this.ticketService.addWorkLogToTicket(this.ticket.id, workLog)
//                     .subscribe(response => {
//                         this.ticket = response;
//                         this.toggleForm(); // to close the form after submission
//                         // Consider adding a message or a toast notification here to inform the user of successful submission.
//                     }, error => {
//                         // Handle errors. For instance, show an error message to the user.
//                         console.error("There was an error submitting the form:", error);
//                     });
//             }, (error) => { console.log("error fetching current user ") }
//         );
//     }
// }

  onFileChange(event: any) {
    const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
    this.file = file as File | null;

    console.log('file name' + file.name);

    if (file) {
      const url = URL.createObjectURL(file);
      this.preview = this.getSanitizedUrl(url);

      this.attachment = {
        name: file.name,
        url: url!
      };
    } else {
      this.preview = null;
      this.attachment = null;
    }
    this.openSnackBar("Attachment has been added", "OK");
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000, // milliseconds
      panelClass: ['custom-snackbar']
    });
  }

  alerted() {
    alert('hi');
  }

  getSanitizedUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  adjustTextareaHeight(textarea: any) {
    textarea.style.height = 'auto'; // Reset the height to auto to calculate the actual height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the height to match the content
  }

  ngOnInit() {
      this.workLogForm = this.formBuilder.group({
      timeSpent: ['', Validators.required],
      timeRemaining: ['', Validators.required],
      dateStarted: ['', Validators.required],
      timeStarted: ['', Validators.required],
      description: ['', Validators.required]
  });

    this.navbarService.collapsed$.subscribe(collapsed => {
      this.navbarIsCollapsed = collapsed;
    });

    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id) {
        // this.getTicketWithId(id);

        this.ticketService.getTicketWithID(id).subscribe(
          (response) => {
            this.ticket = response;
            // console.log(this.ticket, " ticket");
            // console.log("assigned email: ", response.assigned);
            this.assignedGroup = response.group;
            this.currentAssigned = response.assigned;

            if (response.priority == 'Low') {
              this.lowPriority = true;
            } else if (response.priority == 'Medium'){
              this.medPriority = true;
            } else {
              this.highPriority = true;
            }


            // console.log('this.ticket.timeToFirstResponse');
            // console.log(this.ticket.timeToFirstResponse);
            if (this.ticket.timeToFirstResponse) {
              // console.log('this.ticket.timeToFirstResponse');
              const createdAtDateString = this.ticket.createdAt;
              const createdAtDate = new Date(createdAtDateString);

              const timeToFirstResponseString = this.ticket.timeToFirstResponse;
              const timeToFirstResponse = new Date(timeToFirstResponseString);

              const timeDifferenceToFirstResponse = timeToFirstResponse.getTime() - createdAtDate.getTime();
              const daysToFirstResponse = Math.floor(timeDifferenceToFirstResponse / (1000 * 60 * 60 * 24));

              this.timeToFirstResponse = `${daysToFirstResponse} days`;
              if (this.timeToFirstResponse == '1 days') {
                // const hoursToFirstResponse = Math.floor(timeDifferenceToFirstResponse / (1000 * 60 * 60));
                this.timeToFirstResponse = '1 day';
              }
              if (this.timeToFirstResponse == '0 days') {
                const hoursToFirstResponse = Math.floor(timeDifferenceToFirstResponse / (1000 * 60 * 60));
                this.timeToFirstResponse = `${hoursToFirstResponse} hours`;
              }

              if (this.timeToFirstResponse == '1 hours') {
                // const hoursToFirstResponse = Math.floor(timeDifferenceToFirstResponse / (1000 * 60 * 60));
                this.timeToFirstResponse = '1 hour';
              }
              if (this.timeToFirstResponse == '0 hours') {
                const minutesToFirstResponse = Math.floor(timeDifferenceToFirstResponse / (1000 * 60));
                this.timeToFirstResponse = `${minutesToFirstResponse} minutes`
              }

              if (this.timeToFirstResponse == '1 minutes') {
                // const secondsToFirstResponse = Math.floor(timeDifferenceToFirstResponse / (1000));
                this.timeToFirstResponse = '1 minute';
              }
              if (this.timeToFirstResponse == '0 minutes') {
                const secondsToFirstResponse = Math.floor(timeDifferenceToFirstResponse / (1000));
                this.timeToFirstResponse = `${secondsToFirstResponse} seconds`
              }
            }
            if (this.ticket.timeToTicketResolution) {
              const createdAtDateString = this.ticket.createdAt;
              const createdAtDate = new Date(createdAtDateString);

              const timeToTicketResolutionString = this.ticket.timeToTicketResolution;
              const timeToTicketResolution = new Date(timeToTicketResolutionString);

              const timeDifferenceToTicketResolution = timeToTicketResolution.getTime() - createdAtDate.getTime();
              const daysToTicketResolution = Math.floor(timeDifferenceToTicketResolution / (1000 * 60 * 60 * 24));
              this.timeToTicketResolution = `${daysToTicketResolution} days`;

              if (this.timeToTicketResolution == '1 days') {
                const hoursToTicketResolution = Math.floor(timeDifferenceToTicketResolution / (1000 * 60 * 60));
                this.timeToTicketResolution = `${hoursToTicketResolution} hours`;
              }
              if (this.timeToTicketResolution == '0 days') {
                const hoursToTicketResolution = Math.floor(timeDifferenceToTicketResolution / (1000 * 60 * 60));
                this.timeToTicketResolution = `${hoursToTicketResolution} hours`;
              }

              if (this.timeToTicketResolution == '1 hours') {
                this.timeToTicketResolution = '1 hour';
              }
              if (this.timeToTicketResolution == '0 hours') {
                const minutesToTicketResolution = Math.floor(timeDifferenceToTicketResolution / (1000 * 60));
                this.timeToTicketResolution = `${minutesToTicketResolution} minutes`
              }

              if (this.timeToTicketResolution == '1 minutes') {
                this.timeToTicketResolution = '1 minute';
              }
              if (this.timeToTicketResolution == '0 minutes') {
                const secondsToTicketResolution = Math.floor(timeDifferenceToTicketResolution / (1000));
                this.timeToTicketResolution = `${secondsToTicketResolution} seconds`
              }

            }

            this.showAll();
            this.authService.getUserNameByEmail(response.assignee).subscribe(
              (response) => {
                this.assigneeUser = response;
                this.assigneeName = response.name;
                this.assigneeImage = response.profilePhoto;


                for (let i = 0; i < this.ticket.todoChecked.length; i++) {
                  this.todosChanged[i] = this.ticket.todoChecked[i];
                }

                console.log("todosChanged: ", this.todosChanged);
              }
            )
          }
        )
      }
    });

    this.getCurrentUserImage();

    // this.attachmentsOnly = false;
  }


  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  getTicketWithId(ticketId: string) {
    this.ticketService.getTicketWithID(ticketId).subscribe((response: ticket) => {
      this.ticket = response;
      // console.log(this.ticket.id);
      if (!this.ticket.comments) {
        this.ticket.comments = [];
      }

      this.ticket.comments.reverse();
      this.showAll();

      console.log(this.ticket.comments);
      if (this.ticket.comments) {
        for (const comment of this.ticket.comments) {
          if (comment.attachment && comment.attachment.url) {
            console.log('Attachment URL:', comment.attachment.url);
          }
        }
      }

      this.authService.getUserNameByEmail(this.ticket.assignee).subscribe(
        (respone) => {
          this.assigneeUser = respone;
          this.assigneeImage = this.assigneeUser.profilePhoto;
          console.log("AssigneeImage: ", this.assigneeImage);
        }
      )


      // this.getAssigneeUserImage(this.ticket.assignee);


    });
  }

  saveData(): void {
    const newComment = this.commentInputControl.value;
    console.log('Input Value:', newComment);
    console.log('Selected File:', this.file);

    if (!newComment && !this.file) {
      console.log('No comment or file selected');
      return;
    }

    this.uploadProgress = 0;

    if (newComment && this.file) {
      this.ticketService.uploadFile(this.file).subscribe(
        (result: any) => {
          const attachmentData: attachment = {
            name: this.editedAttachmentName || this.file?.name || '',
            url: result.url
          };
          // Add the comment and the first response time
          this.addComment(newComment, attachmentData);

          // Edwin's Notifications
          const currentUser = this.authService.getUser();

          const profilePhotoLink = currentUser.profilePhoto;
          const notificationMessage = " uploaded and commented on a ticket";
          const creatorEmail = currentUser.emailAddress;
          const assignedEmail = this.ticket.assignee; // will eventually have to change assignee to email or an object. This is incomplete for now
          const ticketSummary = "On Ticket: " + this.ticket.summary;
          const ticketStatus = this.ticket.status;
          const notificationTime = new Date();
          const link = this.ticket.id;
          const readStatus = "Unread";

          this.notificationsService.newNotification(profilePhotoLink, notificationMessage, creatorEmail, assignedEmail, ticketSummary, ticketStatus, notificationTime, link, readStatus).subscribe((response: any) => {
            console.log(response);
          });
        },
        (error: any) => {
          console.log('Error uploading file', error);
        }
      );
    } else if (newComment) {
      const emptyAttachment: attachment = {
        name: '',
        url: ''
      };
      // Add the comment and the first response time
      this.addComment(newComment, emptyAttachment);

      // Edwin's Notifications
      const currentUser = this.authService.getUser();

      const profilePhotoLink = currentUser.profilePhoto;
      const notificationMessage = " commented on a ticket";
      const creatorEmail = currentUser.emailAddress;
      const assignedEmail = this.ticket.assignee; // will eventually have to change assignee to email or an object. This is incomplete for now
      const ticketSummary = "On Ticket: " + this.ticket.summary;
      const ticketStatus = this.ticket.status;
      const notificationTime = new Date();
      const link = this.ticket.id;
      const readStatus = "Unread";

      this.notificationsService.newNotification(profilePhotoLink, notificationMessage, creatorEmail, assignedEmail, ticketSummary, ticketStatus, notificationTime, link, readStatus).subscribe((response: any) => {
        console.log(response);
      });

    } else if (this.file) {
      this.ticketService.uploadFile(this.file).subscribe(
        (result: any) => {
          console.log('File uploaded successfully', result);
          const attachmentData: attachment = {
            name: this.editedAttachmentName || this.file?.name || '',
            url: result.url
          };
          // Add the comment and the first response time
          this.addComment('', attachmentData);

          // Edwin's Notifications
          const currentUser = this.authService.getUser();

          const profilePhotoLink = currentUser.profilePhoto;
          const notificationMessage = " uploaded a document on a ticket";
          const creatorEmail = currentUser.emailAddress;
          const assignedEmail = this.ticket.assignee; // will eventually have to change assignee to email or an object. This is incomplete for now
          const ticketSummary = "On Ticket: " + this.ticket.summary;
          const ticketStatus = this.ticket.status;
          const notificationTime = new Date();
          const link = this.ticket.id;
          const readStatus = "Unread";

          this.notificationsService.newNotification(profilePhotoLink, notificationMessage, creatorEmail, assignedEmail, ticketSummary, ticketStatus, notificationTime, link, readStatus).subscribe((response: any) => {
            console.log(response);
          });

          // location.reload();
        },
        (error: any) => {
          console.log('Error uploading file', error);
        }
      );
    }
  }


  updateEditedAttachmentName(event: any): void {
    this.editedAttachmentName = event.target.value;
  }


  getCurrentUserName(){
    return this.authService.getName();
  }

  getCurrentUserImage(){
    return this.authService.getUserObject().subscribe((result: user) => {
      this.userProfilePic = result.profilePhoto;
      this.userId = result.id;
    });
  }

  // addComment(comment: string, attachment: attachment): void {
  //   this.ticketService.makeAComment(this.ticket.id, comment, this.getCurrentUserName(), this.userProfilePic, 'Internal Note', attachment).subscribe(

  //     res => {
  //       console.log('Comment added successfully', res);
  //       location.reload();
  //     },
  //     err => {
  //       console.log('Error while adding comment', err);
  //     }
  //   );
  // }

  addComment(comment: string, attachment: attachment): void {
    const commentTime = new Date(); // Here we create commentTime

    // Get currently logged in user
    let currentUser!: user;

    this.authService.getUserObject().subscribe(
      (response) => {
        currentUser = response;

        // Only proceed with adding the time to first response if the current user is the assigned user
        console.log("assigned: ", this.ticket.assigned);
        console.log("current: ", currentUser);

        if (this.ticket.assigned === currentUser.emailAddress) {
          console.log("should go in here");
          this.ticketService.makeAComment(this.ticket.id, comment, this.getCurrentUserName(), this.userProfilePic, 'Comment', attachment).subscribe(
            res => {
              console.log('Comment added successfully', res);
              // If comment is successfully added, add the time to first response
              this.ticketService.addTimeToFirstResponse(this.ticket.id, commentTime).subscribe(
                res => {
                  console.log('First response time added', res);
                  // location.reload();
                },
                err => {
                  console.log('Error while adding first response time', err);

                  if(err.status === 200)
                    location.reload();
                }
              );
            },
            err => {
              console.log('Error while adding comment', err);
            }
          );
        } else {
          this.ticketService.makeAComment(this.ticket.id, comment, this.getCurrentUserName(), this.userProfilePic, 'Comment', attachment).subscribe(
            res => {
              console.log('Comment added successfully', res);
              location.reload();
            },
            err => {
              console.log('Error while adding comment', err);
            }
          );
        }
      }, (error) => { console.log("error fetching current user ")}
    );

  }


  // Edwin's Code
  todoEmpty() {
    if (this.ticket.todo.length === 0) {
      return true;
    }
    else {
      return false;
    }
  }

  async getAssigneeUserImage(email: string) {
    try {
      // const response: user = await this.authService.getUserNameByEmail(email).toPromise() as user;
      // this.assigneeUser = response;
      // this.assigneeImage = this.assigneeUser.profilePhoto;
      // console.log("AssigneeImage: ", this.assigneeImage);
      this.authService.getUserNameByEmail(email).subscribe(
        (respone) => {
          this.assigneeUser = respone;
          this.assigneeImage = this.assigneeUser.profilePhoto;
          console.log("AssigneeImage: ", this.assigneeImage);
        }
      )
    } catch (error) {
      console.error('Error fetching assignee user image:', error);
    }
  }

  saveTodos() {
    this.checkChanges = false;

    console.log("todosChanged: ", this.todosChanged);


    this.ticketService.updateTodoChecked(this.ticket.id, this.todosChanged).subscribe((response) => {
      console.log(response);
      location.reload();
    });

  }

  onCheckChanged(i: number) {
    this.checkChanges = true;

    this.todosChanged[i] = !this.todosChanged[i];
  }


  isPDF(url: string): boolean {
    return url.toLowerCase().endsWith('.pdf');
  }

  updateTicketStatus(): void {
    if(this.ticket && this.selectedStatus){
      this.ticketService.updateTicketStatus(this.ticket.id, this.selectedStatus)
        .subscribe(response => {
          this.ticket.status = this.selectedStatus as "Done" | "Pending" | "Active";
          location.reload();
          console.log('ticket status is ' + this.ticket.status);
          console.log('ticket id is ' + this.ticket.id);
        }, error => {
          console.error('Error updating status:', error);
        });
    }
  }

  isCommentValid(comment: any):boolean {
    return comment?.attachment?.name && this.isPDF(comment.attachment.url);
  }

  viewAttachments(): void {
    this.attachmentsOnly = true;
    this.historyOnly = false;
  }

  viewAllComments(): void {
    this.attachmentsOnly = false;
    this.historyOnly = false;
  }

  allActivities: (comment | worklog)[] = [];

  displayedComments?: comment[] = [];
  displayedHistory?: history[] = [];

  displayedItems: (comment | worklog)[] = [];

// showAll(): void {
//   this.activeTab = 'All';

//   // Create a merged array of comments and worklogs
//   let combinedItems: (comment | worklog)[] = [];

//   console.log("showAll function triggered.");

//   if (this.ticket) {
//     console.log("ticket object exists.");

//     if (this.ticket.comments) {
//       console.log(`Found ${this.ticket.comments.length} comments.`);
//       combinedItems = combinedItems.concat(this.ticket.comments);
//     } else {
//       console.log("No comments found.");
//     }

//     if (this.ticket.workLogs) {
//       console.log(`Found ${this.ticket.workLogs.length} worklogs.`);
//       combinedItems = combinedItems.concat(this.ticket.workLogs);
//     } else {
//       console.log("No worklogs found.");
//     }

//   } else {
//     console.error("ticket object does not exist.");
//     return;
//   }

//   // Sort combinedItems by timestamp
//   combinedItems.sort((a, b) => {
//     const timeStampA = 'createdAt' in a ? new Date(a.createdAt).getTime() : new Date(a.dateStarted + 'T' + a.timeStarted + ':00').getTime();
//     const timeStampB = 'createdAt' in b ? new Date(b.createdAt).getTime() : new Date(b.dateStarted + 'T' + b.timeStarted + ':00').getTime();

//     return timeStampB - timeStampA; // This sorts in descending order. Switch the subtraction if you want ascending order.
//   });

//   this.displayedItems = combinedItems;
//   console.log(`Total items to display: ${this.displayedItems.length}`);
// }


  showAll(): void {
    this.activeTab = 'All';
    this.displayedComments = [];
    if(this.ticket && this.ticket.comments){
      this.displayedComments = this.ticket.comments;
      if (this.numReversed != 1) {
        this.displayedComments.reverse();
        // alert('reverse');
        this.numReversed = 1;
      }
    }

    this.historyOnly = false;
    this.displayedHistory = [];
    if (this.ticket.history != null) {
      this.displayedHistory = this.ticket.history;
    }

    this.displayedWorklogs = [];
    if (this.ticket) {
      if (this.ticket.workLogs) {
        this.displayedWorklogs = this.ticket.workLogs.slice().reverse();
      }
    }


  }

  showAttachmentsOnly(): void {
    this.historyOnly = false;
    this.displayedWorklogs = [];
    this.displayedHistory = [];
    this.displayedComments = this.ticket.comments?.filter(comment => comment.attachment && comment.attachment.url);
    console.log(this.displayedComments);
  }

  showCommentsOnly(): void {
    this.historyOnly = false;
    this.displayedWorklogs = [];
    this.displayedHistory = [];
    this.displayedComments = this.ticket.comments?.filter(comment => !comment.attachment?.url);
    console.log(this.displayedComments);
  }

  showHistoryOnly(): void {
    this.displayedWorklogs = [];
    this.displayedComments = [];
    this.displayedHistory = [];
    this.historyOnly = true;

    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id) {
        this.ticketService.getTicketWithID(id).subscribe(
          (response) => {
            this.ticket = response;
            if (this.ticket.history != null) {
              this.displayedHistory = this.ticket.history;
            }

            if (this.numReversedHistory != 1) {
              this.displayedHistory?.reverse();
              this.numReversedHistory = 1;
            }
          });
      }
    });

  }


  displayedWorklogs?: worklog [] = [];

  showWorkLogs(): void {
    this.activeTab = 'Work Logs';
    this.displayedComments = []; // Clear the displayed comments array when showing work logs
    this.displayedHistory = [];
    this.displayedWorklogs = [];
    if (this.ticket) {
      if (this.ticket.workLogs) { // Check if workLogs property is defined
        this.displayedWorklogs = this.ticket.workLogs.slice().reverse();
        this.numReversed = 0;
      }
    }
  }


  highlightButton(event: any) {
    console.log(event);
    const buttons = document.getElementsByClassName('activity-filter-button');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('selected');
    }
    event.target.classList.add('selected');
  }



  goBack(){
    this.router.navigate(['/dashboard']);
  }

  handleKeyUp(){
    return;
  }
}
