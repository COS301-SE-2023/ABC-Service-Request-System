import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-dash-panel',
  templateUrl: './dash-panel.component.html',
  styleUrls: ['./dash-panel.component.scss']
})

export class DashPanelComponent {
  @Output() openForm = new EventEmitter<void>();
  @Input() tickets: any[] = [];

  openNewTicketForm() {
    this.openForm.emit();
  }
}
