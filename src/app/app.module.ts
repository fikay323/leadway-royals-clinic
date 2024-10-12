import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShellComponent } from './features/shell/shell.component';
import { LoginComponent } from './features/auth/partials/login/login.component';
import { RegisterComponent } from './features/auth/partials/register/register.component';
import { AuthComponent } from './features/auth/auth.component';
import { SharedModule } from './shared/shared.module';
import { SidenavComponent } from './features/shell/partials/sidenav/sidenav.component';
import { NavbarComponent } from './features/shell/partials/navbar/navbar.component';
import { TestRouteComponent } from './features/shell/partials/test-route/test-route.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SettingsComponent } from './features/settings/settings.component';
import { EditProfileComponent } from './features/settings/partials/edit-profile/edit-profile.component';
import { SettingsMenuDesktopComponent } from './features/settings/partials/settings-menu-desktop/settings-menu-desktop.component';
import { SettingsMenuMobileComponent } from './features/settings/partials/settings-menu-mobile/settings-menu-mobile.component';
import { SchedulesComponent } from './features/schedules/schedules.component';
import { DoctorDashboardComponent } from './features/dashboard/partials/doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './features/dashboard/partials/patient-dashboard/patient-dashboard.component'
import { environment } from '../environments/environment.development';
import { ChatComponent } from './features/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    SidenavComponent,
    NavbarComponent,
    TestRouteComponent,
    DashboardComponent,
    SettingsComponent,
    EditProfileComponent,
    SettingsMenuDesktopComponent,
    SettingsMenuMobileComponent,
    SchedulesComponent,
    DoctorDashboardComponent,
    PatientDashboardComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
