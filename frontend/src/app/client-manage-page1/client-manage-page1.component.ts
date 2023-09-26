import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ClientService } from 'src/services/client.service';
import { client } from '../../../../backend/clients/src/models/client.model';

@Component({
  selector: 'app-client-manage-page1',
  templateUrl: './client-manage-page1.component.html',
  styleUrls: ['./client-manage-page1.component.scss']
})
export class ClientManagePage1Component implements OnInit {
  @Output() backClicked = new EventEmitter<void>();
  @Output() continueClicked = new EventEmitter<void>();
  @Output() selectedClient: EventEmitter<any> = new EventEmitter<any>();

  selectedOption!: client;
  isDropDownOpen = false;

  organisationsToShow: client[] = [];

  constructor (private clientService: ClientService) {}

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients() {
    this.clientService.getAllClients().subscribe(
      (response) => {

        if(response) {
          response.forEach((client) => {
            const isExistingClient = this.organisationsToShow.some((existingClient) => {
              return existingClient.organisation === client.organisation;
            });

            if (!isExistingClient) {
              this.organisationsToShow.push(client);
            }
          })
        }

      }, (error) => {
        console.log("Error getting all clients", error);
      }
    )
  }

  selectOption(organisation: client){
    this.selectedOption = organisation;
    console.log(this.selectedOption);
    this.toggleDropDown();
  }

  toggleDropDown(){
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  onBackClicked(): void{
    this.backClicked.emit();
  }

  onContinueClicked(): void{
    this.selectedClient.emit(this.selectedOption);
    this.continueClicked.emit();
  }
}
