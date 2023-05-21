import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashPanelComponent } from './dash-panel/dash-panel.component';
import { LoginPageComponent } from './login-page/login-page.component';

import { HttpClientModule } from '@angular/common/http';
import { PageHeaderComponent } from './page-header/page-header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TicketDashboardComponent } from './ticket-dashboard/ticket-dashboard.component';
import { TicketItemComponent } from './ticket-item/ticket-item.component';
import 'tslib';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    PageHeaderComponent,
    DashboardComponent,
    DashPanelComponent,
    TicketDashboardComponent,
    TicketItemComponent
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
