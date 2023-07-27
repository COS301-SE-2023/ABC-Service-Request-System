import { Component } from '@angular/core';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss']
})
export class UserDropdownComponent {

  selectedOption!: string | null;
  isDropDownOpen = false;

  selectOption(text: string | null){
    this.selectedOption = text;
  }

  toggleDropDown(){
    this.isDropDownOpen = !this.isDropDownOpen;
  }
}
