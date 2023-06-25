import { Component, Input } from '@angular/core';
import { notifications } from '../../../../backend/src/models/notifications.model';

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent {
  @Input() notifications!: notifications;
}
