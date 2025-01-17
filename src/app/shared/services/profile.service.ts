import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { User } from '../models/user.model';
import { ErrorHandlerService } from './error-handler.service';
import { FirestoreService } from './firestore.service';

export interface PersonalInformation {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  age: string;
  address: string;
  phoneNumber: string;
}

export interface MedicalHistory {
  pastMedicalConditions: string[];
  currentMedications: string[];
  allergies: string[];
}

export interface VitalSigns {
  bloodPressure: string;
  temperature: string;
  heartRate: string;
  weight: string;
}

export interface InformationForm {
  personalInformation: PersonalInformation;
  medicalHistory: MedicalHistory;
  vitalSigns: VitalSigns;
}

@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  private destroy$ = new Subject<void>()

  constructor(private afs: AngularFirestore, private errorHandlerService: ErrorHandlerService, private firestoreService: FirestoreService) { }

  createUserWithBasicInfo(user: User) {
    return from(
      this.afs
        .collection('users')
        .doc(user.uid) 
        .set(user)
    ).pipe(
      catchError(err => {
        this.errorHandlerService.handleError(err)
        return of(null)
      })
    )
  }

  getUserBasicInfo(uid) {
    return this.firestoreService.listenToDocument<User>(`users/${uid}`).pipe(takeUntil(this.destroy$))
  }
  
  getPersonalInformation(user$: Observable<User>): Observable<InformationForm> {
    const userUID = this.getUserUID(user$)
    return this.getUserBasicInfo(userUID).pipe(
      map(user => user?.personalInformation), // Extract personal information only
      catchError(err => {
        this.errorHandlerService.handleError(err)
        return of(null)
      })
    )
  }
  
  updateUserPersonalInformation(information: InformationForm, user$: Observable<User>) {
    const userUID = this.getUserUID(user$)
    return from(this.afs.doc<User>(`users/${userUID}`).update({
      personalInformation: information
    })).pipe(
      catchError(err => {
        this.errorHandlerService.handleError(err)
        return of(null)
      })
    )
  }

  private getUserUID(user$) {
    let userUID
    user$.subscribe(user => {
      userUID = user.uid
    })
    return userUID
  }

  ngOnDestroy() {
    this.destroy$.next(); // Emit to complete all subscriptions
    this.destroy$.complete(); // Complete the Subject
  }
}
