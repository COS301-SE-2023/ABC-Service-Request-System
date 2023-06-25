import { Component, Input } from '@angular/core';
import { comment } from '../../../../backend/src/models/ticket.model';

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
}
