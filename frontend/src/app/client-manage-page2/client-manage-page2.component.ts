import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-client-manage-page2',
  templateUrl: './client-manage-page2.component.html',
  styleUrls: ['./client-manage-page2.component.scss']
})
export class ClientManagePage2Component {
  @Output() backClicked = new EventEmitter<void>();
  @Output() completeClicked = new EventEmitter<void>();
  @Output() editClicked = new EventEmitter<void>();

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

  onEditClicked(): void{
    this.editClicked.emit();
  }
}
