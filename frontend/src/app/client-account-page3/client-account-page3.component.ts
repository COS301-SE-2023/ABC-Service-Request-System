import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-account-page3',
  templateUrl: './client-account-page3.component.html',
  styleUrls: ['./client-account-page3.component.scss']
})
export class ClientAccountPage3Component implements OnInit{
  @Output() backClicked = new EventEmitter<void>();
  @Output() completeClicked = new EventEmitter<void>();

  @Input() formData: any;

  projectImageUrl!: string;

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

  ngOnInit(): void {
    this.setRandomImage();
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

  setRandomImage(): void {
    const imageFolder = '../../assets/project-logos/';
    const imageNames = ['camera.png', 'coffee-cup.png', 'computer.png', 'eight.png', 'flask.png', 'hotdog.png', 'laptop.png', 'notebook.png', 'smartphone.png', 'vynil.png', 'wallet.png', 'web-design.png'];

    const randomIndex = Math.floor(Math.random() * imageNames.length);
    const randomImageName = imageNames[randomIndex];

    this.projectImageUrl = imageFolder + randomImageName;
  }
}
