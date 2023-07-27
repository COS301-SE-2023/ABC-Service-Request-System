import { Component, Input, OnInit } from '@angular/core';
import { group } from '../../../../backend/groups/src/models/group.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-tablet',
  templateUrl: './group-tablet.component.html',
  styleUrls: ['./group-tablet.component.scss']
})
export class GroupTabletComponent  {
  @Input()
  group!: group;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private router: Router) { }

  @Input() selectedGroup!: group;

  isSelected(): boolean {
    return this.selectedGroup && this.group && this.selectedGroup.id === this.group.id;
  }

  routeToAnalytics(): void {
    this.router.navigateByUrl('/analytics-page');
  }
}
