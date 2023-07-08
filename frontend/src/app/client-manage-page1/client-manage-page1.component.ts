import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-client-manage-page1',
  templateUrl: './client-manage-page1.component.html',
  styleUrls: ['./client-manage-page1.component.scss']
})
export class ClientManagePage1Component {
  @Output() backClicked = new EventEmitter<void>();
  @Output() continueClicked = new EventEmitter<void>();

  selectedOption!: string | null;
  isDropDownOpen = false;

  selectOption(text: string | null){
    this.selectedOption = text;
  }

  toggleDropDown(){
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  onBackClicked(): void{
    this.backClicked.emit();
  }

  onContinueClicked(): void{
    this.continueClicked.emit();
  }
}
