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
    UserDropdownComponent,
    ClientAccountPage1Component,
    ClientAccountPage2Component,
    ClientAccountPage3Component,
    ClientAccountPage4Component,
    ClientManagePage1Component,
    ClientManagePage2Component,
    ClientManagePage3Component,
    InternalAccountPage1Component,
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
    MatCheckboxModule,
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
