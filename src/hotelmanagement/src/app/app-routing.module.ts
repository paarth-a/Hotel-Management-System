import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './routes/login/login.component';
import {RegisterComponent} from './routes/register/register.component';
import {AdmindashComponent} from './routes/admindash/admindash.component';
import {UserdashComponent} from './routes/userdash/userdash.component';
import { HomeComponent } from './routes/home/home.component';

import { AuthGuard } from "./auth-guard";
import { PreventLoggedInAccess } from "./not-auth-guard";
import { AdminGuard } from './admin-guard';

const routes: Routes = [
    {path: 'login', component:LoginComponent, canActivate: [PreventLoggedInAccess]},
    {path: 'register', component:RegisterComponent, canActivate: [PreventLoggedInAccess]},
    {path: 'admin', component:AdmindashComponent, canActivate:[AuthGuard]},
    {path: 'user', component:UserdashComponent, canActivate:[AuthGuard]},
    {path: '', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
