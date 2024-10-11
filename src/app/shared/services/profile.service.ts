import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PersonalInformation {
  fullName: string;
  dateOfBirth: Date;
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
  private _personalInformation: InformationForm = {
    personalInformation: {
      fullName: 'Fagbenro Oluwafikayomi Caleb',
      dateOfBirth: new Date('06-03-2006'),
      gender: 'male',
      age: '60',
      address: 'Anenike, School Area',
      phoneNumber: '09060640930'
    },
    medicalHistory: {
      pastMedicalConditions: ['Kidney stones', 'Liver failure'],
      currentMedications: ['Paracetamol', 'Panadol'],
      allergies: ['Brokeness', 'Love'],
    },
    vitalSigns: {
      bloodPressure: '90',
      temperature: '34',
      heartRate: '60',
      weight: '55',
    }
  }
  private _personalInformation$: BehaviorSubject<InformationForm> = new BehaviorSubject(this._personalInformation)

  constructor() { }
  
  getPersonalInformation(): Observable<InformationForm> {
    return this._personalInformation$.asObservable()
  }

  updatePersonalInformation(information: InformationForm) {
    this._personalInformation$.next(information)
  }
}
