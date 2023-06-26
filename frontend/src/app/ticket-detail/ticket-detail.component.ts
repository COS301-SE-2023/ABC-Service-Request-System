/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tickets } from '../data';
import { Subscription } from 'rxjs';
import { TicketsService } from 'src/services/ticket.service';
import { AuthService } from 'src/services/auth.service';
import { ticket } from '../../../../backend/src/models/ticket.model';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})

export class TicketDetailComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private ticketService: TicketsService, private sanitizer: DomSanitizer, private authService: AuthService) { }

  ticket!: ticket;
  ticketPanelOpenState = false;
  SLAPanelOpenState = true;
  detailsPanelOpenState = true;
  private routeSubscription: Subscription = new Subscription();
  commentInputControl = new FormControl('');
  textareaValue = '';

  file: File | null = null;
  selectedStatus = '';

  onFileChange(event: any) {
    const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
    this.file = file as File | null;
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
      // this.ticket = tickets.find(ticket => ticket.id === Number(id));
      if(id)
        this.getTicketWithId(id);
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  getTicketWithId(ticketId: string){
    this.ticketService.getTicketWithID(ticketId).subscribe((resonse: ticket) => {
      this.ticket = resonse;
    })
  }

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

    if (newComment && this.file) {
      this.ticketService.uploadFile(this.file).subscribe(
        (result: any) => {
          const attachmentUrl = result.url;
          this.addComment(newComment, attachmentUrl);
        },
        (error: any) => {
          console.log('Error uploading file', error);
        }
      );
    } else if (newComment) {
      this.addComment(newComment, '');
    } else {
      this.ticketService.uploadFile(this.file!).subscribe(
        (result: any) => {
          console.log('File uploaded successfully', result);
          this.addComment('',result.url);
          location.reload();
        },
        (error: any) => {
          console.log('Error uploading file', error);
        }
      );
    }
  }

  getCurrentUserName(){
    return this.authService.getName();
  }

  addComment(comment: string, attachmentUrl: string): void {
    this.ticketService.makeAComment(this.ticket.id, comment, this.getCurrentUserName(), 'comment', attachmentUrl).subscribe(
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


}

