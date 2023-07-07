/* eslint-disable no-self-assign */
import { Component, Input } from '@angular/core';
import { user } from '../../../../backend/src/models/user.model';

@Component({
  selector: 'app-user-tablet',
  templateUrl: './user-tablet.component.html',
  styleUrls: ['./user-tablet.component.scss'],
})
export class UserTabletComponent  {

  @Input()
  user!: user;
  @Input()
  userImages!: Map<string, string>;

  getProfilePhoto(): string | undefined {
    return this.userImages.get(this.user.id);
  }
}
