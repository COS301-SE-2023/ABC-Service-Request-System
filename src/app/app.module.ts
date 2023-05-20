import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashPanelComponent } from './dash-panel/dash-panel.component';

import { HttpClientModule } from '@angular/common/http';
import { TicketDashboardComponent } from './ticket-dashboard/ticket-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    DashPanelComponent,
    TicketDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
