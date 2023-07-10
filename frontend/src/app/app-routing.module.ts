import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { CreateAccountComponent } from './create-account/create-account.component';
// import { AuthGuard } from 'src/services/auth.guard';

import { SettingsComponent } from './settings/settings.component';
import { SettingsGeneralComponent } from './settings-general/settings-general.component';
import { SettingsNotificationsComponent } from './settings-notifications/settings-notifications.component';
import { SettingsProfileComponent } from './settings-profile/settings-profile.component';
import { NewTicketFormComponent } from './new-ticket-form/new-ticket-form.component';
import { TeamsPageComponent } from './teams-page/teams-page.component';
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardComponent },
 // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'ticket/:id', component: TicketDetailComponent },
  { path: 'activate_account/:token', component: ActivateAccountComponent },
  { path: 'analytics-page', component: AnalyticsPageComponent},
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'new-ticket-form', component: NewTicketFormComponent},
  { path: 'settings-notifications',component: SettingsNotificationsComponent},
  { path: 'settings-profile',component: SettingsProfileComponent},
  { path: 'teams', component: TeamsPageComponent},
  { path: 'settings', component: SettingsProfileComponent },
  { path: 'view-profile',component: ViewProfileComponent},
  //{ path: 'settings-profile',component: SettingsProfileComponent},
  { path: '**', redirectTo: '/login' }, //fallback
  // { path: 'settings-general', component: SettingsGeneralComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

