import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';


const routes: Routes = [
  { path: 'ticket/:id', component: TicketDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
