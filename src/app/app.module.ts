import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
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
import { PastSchedulesComponent } from './features/past-schedules/past-schedules.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AboutUsComponent } from './features/about-us/about-us.component';

@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    SidenavComponent,
    NavbarComponent,
    DashboardComponent,
    SettingsComponent,
    EditProfileComponent,
    SettingsMenuDesktopComponent,
    SettingsMenuMobileComponent,
    SchedulesComponent,
    DoctorDashboardComponent,
    PatientDashboardComponent,
    ChatComponent,
    PastSchedulesComponent,
    AboutUsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireMessagingModule
  ],
  providers: [
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
