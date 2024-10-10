import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/partials/login/login.component';
import { RegisterComponent } from './features/auth/partials/register/register.component';
import { AuthComponent } from './features/auth/auth.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'auth', component: AuthComponent, children: [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
