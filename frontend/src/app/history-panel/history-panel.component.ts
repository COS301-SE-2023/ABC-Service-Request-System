import { Component , Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-history-panel',
  templateUrl: './history-panel.component.html',
  styleUrls: ['./history-panel.component.scss']
})
export class HistoryPanelComponent {
  @Input() history: any;
}
