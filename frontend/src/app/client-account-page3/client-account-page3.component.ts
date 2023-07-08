import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-client-account-page3',
  templateUrl: './client-account-page3.component.html',
  styleUrls: ['./client-account-page3.component.scss']
})
export class ClientAccountPage3Component {
  @Output() backClicked = new EventEmitter<void>();
  @Output() completeClicked = new EventEmitter<void>();

  hovered = false;

  toggleHover(){
    console.log('came in');
    this.hovered = !this.hovered;
  }

  removeGroupTab(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const groupTabElement = targetElement.closest('.group-tab');
    if (groupTabElement) {
      groupTabElement.remove();
    }
  }

  handleKeyupEvent(event: KeyboardEvent): void {
    console.log("nothing");
  }

  onBackClicked(): void{
    this.backClicked.emit();
  }

  onCompleteClicked(): void{
    this.completeClicked.emit();
  }
}
