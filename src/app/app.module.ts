import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TicketItemComponent } from './ticket-item/ticket-item.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { RouterModule } from '@angular/router';

import { NewTicketFormComponent } from './new-ticket-form/new-ticket-form.component';

@NgModule({
  declarations: [
    AppComponent,
    TicketItemComponent,
    TicketDetailComponent,
    NewTicketFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
