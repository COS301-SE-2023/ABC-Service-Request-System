import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { AuthGuardService } from 'src/services/auth.guard';

import { SettingsComponent } from './settings/settings.component';
import { SettingsGeneralComponent } from './settings-general/settings-general.component';
import { SettingsNotificationsComponent } from './settings-notifications/settings-notifications.component';
import { SettingsProfileComponent } from './settings-profile/settings-profile.component';
import { NewTicketFormComponent } from './new-ticket-form/new-ticket-form.component';
import { TeamsPageComponent } from './teams-page/teams-page.component';
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { NotificationsSearchComponent } from './notifications-search/notifications-search.component';
import { ClientLoginComponent } from './client-login/client-login.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { VideoRoomComponent } from './video-room/video-room.component';

const routes: Routes = [
//   { path: 'login', component: LoginPageComponent },
//   { path: 'client-login', component: ClientLoginComponent},
//   { path: 'client-dashboard', component: ClientDashboardComponent},
//   { path: 'dashboard', component: DashboardComponent },
//  { path: '', redirectTo: '/login', pathMatch: 'full' },
//   { path: 'ticket/:id', component: TicketDetailComponent },
//   { path: 'activate_account/:token', component: ActivateAccountComponent },
//   { path: 'activate_account/:token/client', component: ActivateAccountComponent },
//   { path: 'analytics-page', component: AnalyticsPageComponent},
//   { path: 'create-account', component: CreateAccountComponent },
//   { path: 'new-ticket-form', component: NewTicketFormComponent},
//   { path: 'settings-notifications',component: SettingsNotificationsComponent},
//   { path: 'settings-profile',component: SettingsProfileComponent},
//   { path: 'teams', component: TeamsPageComponent},
//   { path: 'settings', component: SettingsProfileComponent },
//   { path: 'view-profile',component: ViewProfileComponent},
//   { path: 'notifications-search',component: NotificationsSearchComponent},

//   { path: 'room/:roomId',component: VideoRoomComponent},

  { path: 'login', component: LoginPageComponent },
  { path: 'client-login', component: ClientLoginComponent},
  { path: 'client-dashboard', component: ClientDashboardComponent, canActivate: [AuthGuardService] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'ticket/:id', component: TicketDetailComponent, canActivate: [AuthGuardService] },
  { path: 'activate_account/:token', component: ActivateAccountComponent }, // assuming you don't need auth here
  { path: 'activate_account/:token/client', component: ActivateAccountComponent }, // and here
  { path: 'analytics-page', component: AnalyticsPageComponent, canActivate: [AuthGuardService] },
  { path: 'create-account', component: CreateAccountComponent }, // assuming you don't need auth here
  { path: 'new-ticket-form', component: NewTicketFormComponent, canActivate: [AuthGuardService] },
  { path: 'settings-notifications',component: SettingsNotificationsComponent, canActivate: [AuthGuardService] },
  { path: 'settings-profile',component: SettingsProfileComponent, canActivate: [AuthGuardService] },
  { path: 'teams', component: TeamsPageComponent, canActivate: [AuthGuardService] },
  { path: 'settings', component: SettingsProfileComponent, canActivate: [AuthGuardService] },
  { path: 'view-profile',component: ViewProfileComponent, canActivate: [AuthGuardService] },
  { path: 'notifications-search',component: NotificationsSearchComponent, canActivate: [AuthGuardService] },
  { path: 'room/:roomId',component: VideoRoomComponent, canActivate: [AuthGuardService] },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

