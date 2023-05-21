import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: AppComponent },
  { path: '**', redirectTo: '/login' } // fallback
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
