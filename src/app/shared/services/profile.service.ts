import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, from, map, Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { User } from '../models/user.model';
import { ErrorHandlerService } from './error-handler.service';

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

  constructor(private afs: AngularFirestore, private errorHandlerService: ErrorHandlerService) { }

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
    return this.afs.doc<User>(`users/${uid}`).valueChanges()
  }
  
  getPersonalInformation(user$: Observable<User>): Observable<InformationForm> {
    const userUID = this.getUserUID(user$)
    return this.afs.doc<User>(`users/${userUID}`).valueChanges().pipe(
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
  }
