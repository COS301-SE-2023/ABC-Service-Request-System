/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tickets } from '../data';
import { Subscription } from 'rxjs';
import { TicketsService } from 'src/services/ticket.service';
import { AuthService } from 'src/services/auth.service';
import { ticket, attachment } from '../../../../backend/src/models/ticket.model';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss'],
})

export class TicketDetailComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private ticketService: TicketsService, private sanitizer: DomSanitizer, private authService: AuthService, private _snackBar: MatSnackBar) { }

  ticket!: ticket;
  ticketPanelOpenState = false;
  SLAPanelOpenState = true;
  detailsPanelOpenState = true;
  private routeSubscription: Subscription = new Subscription();
  commentInputControl = new FormControl('');
  textareaValue = '';

  file: File | null = null;
  selectedStatus = '';
  preview: SafeUrl | null = null;
  attachment: attachment | null = null;
  editedAttachmentName: string | null = null;

  uploadProgress = 0;


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
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id) {
        this.getTicketWithId(id);
      }
    });
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

      console.log(this.ticket.comments);
      if (this.ticket.comments) {
        for (const comment of this.ticket.comments) {
          if (comment.attachment && comment.attachment.url) {
            console.log('Attachment URL:', comment.attachment.url);
          }
        }
      }
    });
  }//hellooooo


  // addComment(): void {
  //   const newComment = this.commentInputControl.value;
  //   // Perform actions with the input value, e.g., save to database, send to API, etc.
  //   console.log('Input Value:', newComment);
  //   if(newComment){
  //     this.ticketService.makeAComment(this.ticket.id, newComment, 'kolo', 'comment').subscribe(
  //       res => {
  //         console.log('Comment added successfully', res);
  //       },
  //       err => {
  //         console.log('Error while adding comment', err);
  //       }
  //     );
  //   }

  // }

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
          this.addComment(newComment, attachmentData);
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
      this.addComment(newComment, emptyAttachment);
    } else if (this.file) {
      this.ticketService.uploadFile(this.file).subscribe(
        (result: any) => {
          console.log('File uploaded successfully', result);
          const attachmentData: attachment = {
            name: this.editedAttachmentName || this.file?.name || '',
            url: result.url
          };
          this.addComment('', attachmentData);
          location.reload();
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
    return this.authService.getUser().profilePhoto;
  }

  addComment(comment: string, attachment: attachment): void {
    this.ticketService.makeAComment(this.ticket.id, comment, this.getCurrentUserName(), this.getCurrentUserImage(), 'Internal Note', attachment).subscribe(

      res => {
        console.log('Comment added successfully', res);
        location.reload();
      },
      err => {
        console.log('Error while adding comment', err);
      }
    );
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

}
