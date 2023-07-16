import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { client, project } from '../../../../backend/src/models/client.model';

@Component({
  selector: 'app-client-manage-page3',
  templateUrl: './client-manage-page3.component.html',
  styleUrls: ['./client-manage-page3.component.scss']
})
export class ClientManagePage3Component implements OnInit{
  @Output() backClicked = new EventEmitter<void>();
  @Output() completeClicked = new EventEmitter<void>();

  @Input() clientToEdit!: client;
  @Input() projectToEdit!: project;

  hovered = false;

  isLogosOverlayOpen = false;
  projectImageUrl!: string;
  projectImageColor!: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
      this.projectImageUrl = this.projectToEdit.logo;
      this.projectImageColor = this.projectToEdit.color;
  }

  toggleHover(){
    console.log('came in');
    this.hovered = !this.hovered;
  }

  onBackClicked(): void{
    this.backClicked.emit();
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  //Overlays
  toggleLogosOverlay() {
    this.isLogosOverlayOpen = !this.isLogosOverlayOpen;
  }

  setProjectLogo(event: MouseEvent) {
    const buttonElement = event.currentTarget as HTMLButtonElement;
    const imgElement = buttonElement.querySelector('img') as HTMLImageElement;
    this.projectImageUrl = imgElement.src;
    this.projectImageColor = imgElement.className;
  }
}
