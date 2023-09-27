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
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { TeamsPageComponent } from './teams-page/teams-page.component';

import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { GroupTabletComponent } from './group-tablet/group-tablet.component';
import { UserTabletComponent } from './user-tablet/user-tablet.component';
import { GroupsSearchBarComponent } from './groups-search-bar/groups-search-bar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgChartsModule } from 'ng2-charts';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { UserDropdownComponent } from './user-dropdown/user-dropdown.component';
import { ClientAccountPage1Component } from './client-account-page1/client-account-page1.component';
import { ClientAccountPage2Component } from './client-account-page2/client-account-page2.component';
import { ClientAccountPage3Component } from './client-account-page3/client-account-page3.component';
import { ClientAccountPage4Component } from './client-account-page4/client-account-page4.component';
import { ClientManagePage1Component } from './client-manage-page1/client-manage-page1.component';
import { ClientManagePage2Component } from './client-manage-page2/client-manage-page2.component';
import { ClientManagePage3Component } from './client-manage-page3/client-manage-page3.component';
import { InternalAccountPage1Component } from './internal-account-page1/internal-account-page1.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import {MatCheckboxModule} from '@angular/material/checkbox';

import { QuillModule } from 'ngx-quill'
import { ProfileOverlayComponent } from './profile-overlay/profile-overlay.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { NotificationsSearchComponent } from './notifications-search/notifications-search.component';
import { InternalAccountPage2Component } from './internal-account-page2/internal-account-page2.component';
import { WorklogPanelComponent } from './worklog-panel/worklog-panel.component';
import { ClientLoginComponent } from './client-login/client-login.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import * as DarkReader from 'darkreader';

//CONFERENCING
import { SocketIoModule } from "ngx-socket-io";
import { VideoRoomComponent } from './video-room/video-room.component';
import { HistoryPanelComponent } from './history-panel/history-panel.component';
import { ClientRequestsComponent } from './client-requests/client-requests.component';
import { TicketRequestComponent } from './ticket-request/ticket-request.component';
import { DarkModeToggleComponent } from './dark-mode-toggle/dark-mode-toggle.component';
import { EmailReplyComponent } from './email-reply/email-reply.component';

@NgModule({
  declarations: [
    AppComponent,
    AnalyticsPageComponent,
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
    GroupsSearchBarComponent,
    AnalyticsPageComponent,
    UserDropdownComponent,
    ClientAccountPage1Component,
    ClientAccountPage2Component,
    ClientAccountPage3Component,
    ClientAccountPage4Component,
    ClientManagePage1Component,
    ClientManagePage2Component,
    ClientManagePage3Component,
    InternalAccountPage1Component,
    ProfileOverlayComponent,
    ViewProfileComponent,
    NotificationsSearchComponent,
    InternalAccountPage2Component,
    ClientLoginComponent,
    ClientDashboardComponent,
    VideoRoomComponent,
    WorklogPanelComponent,
    HistoryPanelComponent,
    ClientRequestsComponent,
    TicketRequestComponent,
    DarkModeToggleComponent,
    EmailReplyComponent,
  ],
  imports: [
    BrowserModule,
    NgChartsModule,
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
    MatButtonModule,
    MatDialogModule,
    NgSelectModule,
    NgxMatSelectSearchModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    QuillModule.forRoot(),
    SocketIoModule.forRoot({
      url: '/'
    })
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
