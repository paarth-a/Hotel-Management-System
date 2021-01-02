import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// providers
import { AuthGuard } from "./auth-guard";
import { AdminGuard } from "./admin-guard";
import { PreventLoggedInAccess } from "./not-auth-guard";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './routes/login/login.component';
import { RegisterComponent } from './routes/register/register.component';
import { AdmindashComponent } from './routes/admindash/admindash.component';
import { UserdashComponent } from './routes/userdash/userdash.component';
import { HomeComponent } from './routes/home/home.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTabsModule} from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card'
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from './error/error.component'

import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AdmindashComponent,
    UserdashComponent,
    HomeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTabsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule, 
    MatDividerModule, 
    MatCardModule,
    MatSortModule,
    MatPaginatorModule, 
    MatCheckboxModule, 
    MatSelectModule,
    MatDialogModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthGuard, 
    PreventLoggedInAccess],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
