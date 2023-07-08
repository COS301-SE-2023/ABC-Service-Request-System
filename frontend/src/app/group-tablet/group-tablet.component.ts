import { Component, Input, OnInit } from '@angular/core';
import { group } from '../../../../backend/src/models/group.model'

@Component({
  selector: 'app-group-tablet',
  templateUrl: './group-tablet.component.html',
  styleUrls: ['./group-tablet.component.scss']
})
export class GroupTabletComponent  {
  @Input()
  group!: group;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  @Input() selectedGroup!: group;

  isSelected(): boolean {
    return this.selectedGroup && this.group && this.selectedGroup.id === this.group.id;
  }
}
