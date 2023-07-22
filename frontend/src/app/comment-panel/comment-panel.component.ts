import { Component, Input } from '@angular/core';
import { comment } from "../../../../backend/tickets/src/models/ticket.model";


@Component({
  selector: 'app-comment-panel',
  templateUrl: './comment-panel.component.html',
  styleUrls: ['./comment-panel.component.scss']
})
export class CommentPanelComponent {
  @Input() comment!: comment;

  formatDate(){
    alert(this.comment.createdAt);
  }

  getCommentTime(comment: comment): string {
    const commentTime = new Date(comment.createdAt);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - commentTime.getTime();

    // Convert the time difference to minutes, hours, days, etc.
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }
}

//work
