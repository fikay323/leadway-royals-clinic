import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, merge, Observable, of, switchMap, throwError } from 'rxjs';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

import { User } from '../models/user.model';
import { ErrorHandlerService } from './error-handler.service';
import { loginRequest, registerRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user) return afs.doc<User>(`users/${user.uid}`).valueChanges()
        return of(null)
      })
    )
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`)
    const data: User = {
      uid: user.uid,
      email: user.email,
      role: {
        doctor: true
      }
    }
    return userRef.set(data, { merge: true })
  }

  registerUser(registerUserData: registerRequest): Observable<any> {
    return from(this.afAuth.createUserWithEmailAndPassword(registerUserData.email, registerUserData.password)).pipe(
      catchError(error => {
        this.errorHandlerService.handleError(error)
        return of(null)
      })
    )
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
