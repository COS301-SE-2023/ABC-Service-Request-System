
import { Component , Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-worklog-panel',
  templateUrl: './worklog-panel.component.html',
  styleUrls: ['./worklog-panel.component.scss']
})
export class WorklogPanelComponent implements OnInit{
  @Input() worklog: any;
  timeLoggedAgo!: string;
  
  ngOnInit(): void {
    this.calculateTimeLoggedAgo(); 
  }

 

  calculateTimeLoggedAgo(): void {
    const dateStarted = new Date(this.worklog.dateStarted);
    
    const [hours, minutes] = this.worklog.timeStarted.split(':').map(Number);
    const adjustedHour = (hours - 2 + 24) % 24;  // Adjust for GMT+2 and wrap around if needed
  
    this.worklog.adjustedTimeStarted = `${adjustedHour.toString().padStart(2, '0')}:${minutes}`;
  
    const currentDate = new Date();
    const diffInMilliseconds = currentDate.valueOf() - dateStarted.valueOf();
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

