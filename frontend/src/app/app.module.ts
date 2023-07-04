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
import { SettingsComponent } from './settings/settings.component';
import { SettingsGeneralComponent } from './settings-general/settings-general.component';
import { SettingsNotificationsComponent } from './settings-notifications/settings-notifications.component';
import { SettingsProfileComponent } from './settings-profile/settings-profile.component';

import { TicketItemComponent } from './ticket-item/ticket-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//MATERIAL UI
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import { Sort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationsPanelComponent } from './notifications-panel/notifications-panel.component';
import { NotificationItemComponent } from './notification-item/notification-item.component';
import { CommentPanelComponent } from './comment-panel/comment-panel.component';
import { CreateAccountComponent } from './create-account/create-account.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TeamsPageComponent } from './teams-page/teams-page.component';

import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { GroupTabletComponent } from './group-tablet/group-tablet.component';
import { UserTabletComponent } from './user-tablet/user-tablet.component';
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
    NotificationsPanelComponent,
    NotificationItemComponent,
    ActivateAccountComponent,
    CommentPanelComponent,
    CreateAccountComponent,
    SettingsComponent,
    SettingsGeneralComponent,
    SettingsNotificationsComponent,
    SettingsProfileComponent,
    TeamsPageComponent,
    GroupTabletComponent,
    UserTabletComponent,
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
    MatIconModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
