/* eslint-disable no-self-assign */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { user } from "../../../../backend/users/src/models/user.model";

@Component({
  selector: 'app-user-tablet',
  templateUrl: './user-tablet.component.html',
  styleUrls: ['./user-tablet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTabletComponent  {

  @Input()
  user!: user;
  @Input() users: user[] = [];
}
