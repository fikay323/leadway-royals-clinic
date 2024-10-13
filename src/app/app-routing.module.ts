import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/partials/login/login.component';
import { RegisterComponent } from './features/auth/partials/register/register.component';
import { AuthComponent } from './features/auth/auth.component';
import { ShellComponent } from './features/shell/shell.component';
import { TestRouteComponent } from './features/shell/partials/test-route/test-route.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { loggedInGuard } from './shared/guards/logged-in.guard';
import { SettingsComponent } from './features/settings/settings.component';
import { EditProfileComponent } from './features/settings/partials/edit-profile/edit-profile.component';
import { SchedulesComponent } from './features/schedules/schedules.component';
import { ChatComponent } from './features/chat/chat.component';
import { PastSchedulesComponent } from './features/past-schedules/past-schedules.component';

const routes: Routes = [
  { path: '', redirectTo: '/main-app', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent, children: [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
  ] },
  { path: 'main-app', component: ShellComponent, children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'settings', component: SettingsComponent, children: [
      { path: 'edit-profile', component: EditProfileComponent }
    ] },
    { path: 'chats', component: ChatComponent },
    { path: 'schedules', component: SchedulesComponent },
    { path: 'past-schedules', component: PastSchedulesComponent },
  ], canActivate: [loggedInGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
