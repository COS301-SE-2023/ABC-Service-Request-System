import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashPanelComponent } from './dash-panel/dash-panel.component';
import { LoginPageComponent } from './login-page/login-page.component';

import { HttpClientModule } from '@angular/common/http';
import { PageHeaderComponent } from './page-header/page-header.component';
import { DashboardComponent } from './dashboard/dashboard.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { RouterModule } from '@angular/router';

import { NewTicketFormComponent } from './new-ticket-form/new-ticket-form.component';
import { TicketTableComponent } from './ticket-table/ticket-table.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { UpdateTicketModalComponent } from './update-ticket-modal/update-ticket-modal.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';

import { TicketItemComponent } from './ticket-item/ticket-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//MATERIAL UI
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import { Sort, MatSortModule } from '@angular/material/sort';
import { CommentPanelComponent } from './comment-panel/comment-panel.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    DashPanelComponent,
    PageHeaderComponent,
    DashboardComponent,
    TicketTableComponent,
    TicketItemComponent,
    TicketDetailComponent,
    NewTicketFormComponent,
    SearchBarComponent,
    UpdateTicketModalComponent,
    ActivateAccountComponent,
    CommentPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatSortModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
