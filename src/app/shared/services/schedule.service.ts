import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, catchError, forkJoin, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

export interface TimeSlot { 
  startTime: string;        // Start time of the slot in ISO format (e.g., '2024-10-10T09:00:00Z')
  endTime: string;          // End time of the slot in ISO format (e.g., '2024-10-10T10:00:00Z')
  bookerID: string;
  isAvailable: boolean;     // Availability status (true if the slot is available, false otherwise)
}

export interface IndividualDoctorSchedule {
  doctorID: string;
  doctorFirstName?: string,
  timeSlots: TimeSlot[];
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private _doctorsSchedules: IndividualDoctorSchedule[] = [
    {
      doctorID: 'Doctor_001',
      timeSlots: [
        { startTime: '2024-10-14T09:00:00Z', endTime: '2024-10-14T10:00:00Z', bookerID: 'Patient_123', isAvailable: false },
        { startTime: '2024-10-15T10:00:00Z', endTime: '2024-10-15T11:00:00Z', bookerID: 'Patient_456', isAvailable: false },
      ],
    },
    {
      doctorID: 'Doctor_002',
      timeSlots: [
        { startTime: '2024-10-15T10:00:00Z', endTime: '2024-10-15T11:00:00Z', bookerID: 'Patient_789', isAvailable: false },
        { startTime: '2024-10-21T09:00:00Z', endTime: '2024-10-21T10:00:00Z', bookerID: 'Patient_987', isAvailable: false },
      ],
    },
    {
      doctorID: 'Doctor_003',
      timeSlots: [
        { startTime: '2024-10-16T11:00:00Z', endTime: '2024-10-16T12:00:00Z', bookerID: 'Patient_654', isAvailable: false },
      ],
    },
  ];

  private _schedules$: BehaviorSubject<IndividualDoctorSchedule[]> = new BehaviorSubject(this._doctorsSchedules) 
  

  constructor(private afs: AngularFirestore, private errorHandlerService: ErrorHandlerService) {}

  getSchedule(): Observable<IndividualDoctorSchedule[]> {
    return this.afs.collection<IndividualDoctorSchedule>('schedules').valueChanges().pipe(
      map(res => {
        let schedule:IndividualDoctorSchedule[] = []
        res.forEach(doctor => {
          if (Object.keys(doctor).length > 0 && 'timeSlots' in doctor) {
            schedule.push(doctor)
          }
        })
        return schedule
      })
    )
  }

  createDoctorEntry(userCredential) {
    const doctorSchedule: IndividualDoctorSchedule = {
      doctorID: userCredential.user.uid, // Use UID as the doctorID
      timeSlots: [] // Empty time slots initially
    };
    return from(
      this.afs.collection('schedules').doc(doctorSchedule.doctorID).set(doctorSchedule)
    ).pipe(
      catchError(err => {
        this.errorHandlerService.handleError(err)
        return of(null)
      })
    )
  }

  uploadDoctorSchedule(doctorSchedule: IndividualDoctorSchedule): Observable<void> {
    const doctorID = doctorSchedule.doctorID;

    // Convert the Firestore set promise into an observable using 'from'
    return from(
      this.afs
        .collection('schedules')
        .doc(doctorID)
        .set(doctorSchedule)
    ).pipe(
      catchError(err => {
        this.errorHandlerService.handleError(err)
        return of(null)
      })
    )
  }

  // Function to upload multiple schedules
  uploadMultipleSchedules(schedules: IndividualDoctorSchedule[]): Observable<any[]> {
    const uploadObservables = schedules.map(schedule => this.uploadDoctorSchedule(schedule));
    return forkJoin(uploadObservables); // Combine all observables into one
  }
}
