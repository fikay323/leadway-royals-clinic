import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, from, Observable, of, Subject, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Role, User } from '../models/user.model';
import { ErrorHandlerService } from './error-handler.service';
import { loginRequest, registerRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user$: Subject<User> = new BehaviorSubject<User>(null);
  user$ = this._user$.asObservable()

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private errorHandlerService: ErrorHandlerService
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

  // private updateUserData(user: User) {
  //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`)
  //   const data: User = {
  //     uid: user.uid,
  //     email: user.email,
  //     role: user.role
  //   }
  //   return userRef.set(data, { merge: true })
  // }

  registerUser(registerUserData: registerRequest): Observable<any> {
    return from(this.afAuth.createUserWithEmailAndPassword(registerUserData.email, registerUserData.password)).pipe(
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
