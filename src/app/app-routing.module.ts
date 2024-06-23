import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutusComponent } from './aboutus/aboutus.component';
import { HomeComponent } from './home/home.component';
import { MeetComponent } from './meet/meet.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'meet/:roomId', component: MeetComponent },
  { path: 'about', component: AboutusComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
