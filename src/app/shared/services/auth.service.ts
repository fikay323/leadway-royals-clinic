import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, from, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Role, User } from '../models/user.model';
import { ErrorHandlerService } from './error-handler.service';
import { loginRequest, registerRequest } from '../models/auth.model';
import { IndividualDoctorSchedule, ScheduleService } from './schedule.service';
import { NotificationService } from './notification.service';
import { InformationForm, ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user$: Subject<User> = new BehaviorSubject<User>(null);
  user$ = this._user$.asObservable()

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private errorHandlerService: ErrorHandlerService,
    private profileService: ProfileService,
    private scheduleService: ScheduleService,
    private notificationService: NotificationService
  ) {
    const dummyUser: User = {
      uid: 'iicisc',
      firstName: 'Fikayomi',
      lastName: 'Fagbenro',
      role: 'patient',
      email: 'sunday@gmail.com',
      phoneNumber: '09060640930'
    }
    this._user$.next(dummyUser)
  }

  registerUser(registerUserData: registerRequest): Observable<any> {
    return from(this.afAuth.createUserWithEmailAndPassword(registerUserData.email, registerUserData.password)).pipe(
      tap(res => {
        const user: User =  {
          firstName: registerUserData.firstName,
          lastName: registerUserData.lastName,
          email: registerUserData.email,
          uid: res.user.uid,
          phoneNumber: registerUserData.phoneNumber,
          role: (registerUserData.role) as Role,
          personalInformation: {} as InformationForm
        }
        this._user$.next(user)
        this.profileService.createUserWithBasicInfo(user).subscribe()
        this.notificationService.alertSuccess('Account Registered Successfully')
        this.router.navigate(['/main-app', 'dashboard'])
        if (registerUserData.role === 'doctor') this.scheduleService.createDoctorEntry(res).subscribe()
      }),
      catchError(error => {
        this.errorHandlerService.handleError(error)
        return of(null)
      })
    )
  }

  setCredentials(userData: User) {
    this._user$.next(userData)
  }

  login({email: email, password: password}: loginRequest): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      tap(user => {
        this.profileService.getUserBasicInfo(user.user.uid).subscribe(data => {
          this.notificationService.alertSuccess('Login Successful')
          this._user$.next(data)
          this.router.navigate(['/main-app', 'dashboard'])
        })
      }),
      catchError(error => {
        this.errorHandlerService.handleError(error)
        return of(null)
      })
    )
  }

  logout(): Observable<any> {
    return from(this.afAuth.signOut()).pipe(
      catchError(error => {
        this.errorHandlerService.handleError(error)
        return of(null)
      })
    )
  }
}
