import { Component, Input } from '@angular/core';
import { notifications } from '../../../../backend/src/models/notifications.model';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent {
  @Input() notifications!:notifications;
}
