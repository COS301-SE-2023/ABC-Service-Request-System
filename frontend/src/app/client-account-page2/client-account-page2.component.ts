import { Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-client-account-page2',
  templateUrl: './client-account-page2.component.html',
  styleUrls: ['./client-account-page2.component.scss']
})
export class ClientAccountPage2Component {
  @Output() backClicked = new EventEmitter<void>();

  onBackClicked(): void{
    this.backClicked.emit();
  }
}
