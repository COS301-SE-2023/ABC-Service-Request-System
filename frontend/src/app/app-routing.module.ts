import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsGeneralComponent } from './settings-general/settings-general.component';
import { SettingsNotificationsComponent } from './settings-notifications/settings-notifications.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardComponent },
 // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'ticket/:id', component: TicketDetailComponent },
  //{ path: '**', redirectTo: '/login' }, //fallback
  { path: 'settings', component: SettingsComponent },
  { path: 'settings-general', component: SettingsGeneralComponent},
  { path: 'settings-notifications',component: SettingsNotificationsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
