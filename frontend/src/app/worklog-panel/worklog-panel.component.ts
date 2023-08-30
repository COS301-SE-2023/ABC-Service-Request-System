
import { Component , Input} from '@angular/core';

@Component({
  selector: 'app-worklog-panel',
  templateUrl: './worklog-panel.component.html',
  styleUrls: ['./worklog-panel.component.scss']
})
export class WorklogPanelComponent {
  @Input() worklog: any;
  timeLoggedAgo!: string;
  
  ngOnInit(): void {
    this.calculateTimeLoggedAgo(); 
  }

  calculateTimeLoggedAgo(): void {
    const dateStarted = new Date(this.worklog.dateStarted);
    const timeStarted = this.worklog.timeStarted.split(':');
    dateStarted.setUTCHours(+timeStarted[0]);
    dateStarted.setUTCMinutes(+timeStarted[1]);

    const currentDate = new Date();
    const offset = currentDate.getTimezoneOffset() * 60000;
    const currentDateUTC = new Date(currentDate.getTime() - offset);
    const diffInMilliseconds = currentDateUTC.valueOf() - dateStarted.valueOf();
    this.timeLoggedAgo = this.convertMillisecondsToTime(diffInMilliseconds);

    console.log('Time logged ago:', this.timeLoggedAgo);
  }

  

  // calculateTimeLoggedAgo(): void {
  //   const dateStarted = new Date(this.worklog.dateStarted);
  //   const currentDate = new Date();
  //   const diffInMilliseconds = currentDate.valueOf() - dateStarted.valueOf();
  //   this.timeLoggedAgo = this.convertMillisecondsToTime(diffInMilliseconds);
  //   console.log('Time logged ago:', this.timeLoggedAgo);

  // }

  convertMillisecondsToTime(ms: number): string {
    const weeks = Math.floor(ms / (1000 * 60 * 60 * 24 * 7));
    ms -= weeks * (1000 * 60 * 60 * 24 * 7);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    ms -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    ms -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(ms / (1000 * 60));
    let time = '';
    if (weeks) {
      time += `${weeks}w `;
    }
    if (days) {
      time += `${days}d `;
    }
    if (hours) {
      time += `${hours}h `;
    }
    if (minutes) {
      time += `${minutes}m `;
    }
    return time;
  }

}

