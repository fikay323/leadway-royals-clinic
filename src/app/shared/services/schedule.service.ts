import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; 
import { catchError, forkJoin, from, map, Observable, of, tap } from 'rxjs';

import { ErrorHandlerService } from './error-handler.service';
import { User } from '../models/user.model';
import { NotificationService } from './notification.service';
import { InformationForm } from './profile.service';

export interface TimeSlot { 
  startTime: string;        // Start time of the slot in ISO format (e.g., '2024-10-10T09:00:00Z')
  endTime: string;          // End time of the slot in ISO format (e.g., '2024-10-10T10:00:00Z')
  bookerID: string;
  bookerName: {firstName: string, lastName: string},
  bookerPersonalInformation: InformationForm;
  isAvailable: boolean;     // Availability status (true if the slot is available, false otherwise)
  slotID: string;
}

export interface TimeSlotWithDoctorID extends TimeSlot {
  doctorID: string;
  doctorFirstName: string;
  doctorLastName: string;
}

export interface IndividualDoctorSchedule {
  doctorID: string;
  doctorFirstName?: string,
  doctorLastName?: string,
  timeSlots: TimeSlot[];
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  // private _doctorsSchedules: IndividualDoctorSchedule[] = [
  //   {
  //     doctorID: 'Doctor_001',
  //     timeSlots: [
  //       { startTime: '2024-10-14T09:00:00Z', endTime: '2024-10-14T10:00:00Z', bookerID: 'Patient_123', isAvailable: false },
  //       { startTime: '2024-10-15T10:00:00Z', endTime: '2024-10-15T11:00:00Z', bookerID: 'Patient_456', isAvailable: false },
  //     ],
  //   },
  //   {
  //     doctorID: 'Doctor_002',
  //     timeSlots: [
  //       { startTime: '2024-10-15T10:00:00Z', endTime: '2024-10-15T11:00:00Z', bookerID: 'Patient_789', isAvailable: false },
  //       { startTime: '2024-10-21T09:00:00Z', endTime: '2024-10-21T10:00:00Z', bookerID: 'Patient_987', isAvailable: false },
  //     ],
  //   },
  //   {
  //     doctorID: 'Doctor_003',
  //     timeSlots: [
  //       { startTime: '2024-10-16T11:00:00Z', endTime: '2024-10-16T12:00:00Z', bookerID: 'Patient_654', isAvailable: false },
  //     ],
  //   },
  // ];

  // private _schedules$: BehaviorSubject<IndividualDoctorSchedule[]> = new BehaviorSubject(this._doctorsSchedules) 
  

  constructor(
    private afs: AngularFirestore, 
    private errorHandlerService: ErrorHandlerService, 
    private notificationService: NotificationService
  ) {}

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

  generateUUID() {
    return this.afs.createId()
  }

  createDoctorEntry(user: User) {
    const doctorSchedule: IndividualDoctorSchedule = {
      doctorID: user.uid, // Use UID as the doctorID
      doctorFirstName: user.firstName,
      doctorLastName: user.lastName,
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

  bookTimeSlot(timeslot: TimeSlot, doctor: IndividualDoctorSchedule) {
    const doctorScheduleRef = this.afs.collection('schedules').doc(doctor.doctorID);

    return from(doctorScheduleRef.update({
      timeSlots: firebase.firestore.FieldValue.arrayUnion(timeslot)
    })).pipe(
      tap(res => {
        this.notificationService.alertSuccess('Appointment booked successfully')
      }),
      catchError(err => {
        this.errorHandlerService.handleError(err)
        return of(null)
      })
    )
  }

  removeTimeSlot(timeslot: TimeSlot, doctor?: IndividualDoctorSchedule, doctorID?: string) {
    const doctorScheduleRef = this.afs.collection('schedules').doc(doctor ? doctor.doctorID : doctorID);

    return from(doctorScheduleRef.update({
      timeSlots: firebase.firestore.FieldValue.arrayRemove(timeslot)
    })).pipe(
      tap(res => {
        this.notificationService.alertSuccess('Appointment cancelled successfully')
      }),
      catchError(err => {
        this.errorHandlerService.handleError(err)
        return of(null)
      })
    )
  }

  uploadDoctorSchedule(doctorSchedule: IndividualDoctorSchedule): Observable<void> {
    const doctorID = doctorSchedule.doctorID;

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

  getAllPatientSchedules(userUID): Observable<TimeSlotWithDoctorID[]> {
    return this.afs.collection(`schedules`).valueChanges().pipe(
      map((doctorsSchedule: IndividualDoctorSchedule[]) => {
        const timeSlots: TimeSlotWithDoctorID[] = []
        doctorsSchedule.forEach(doctorSchedule => {
          doctorSchedule.timeSlots.forEach(slot => {
            if(slot.bookerID === userUID) {
              const newSlot: TimeSlotWithDoctorID = {
                ...slot,
                doctorID: doctorSchedule.doctorID,
                doctorFirstName: doctorSchedule.doctorFirstName,
                doctorLastName: doctorSchedule.doctorLastName,
              }
              timeSlots.push(newSlot)
            }
          })
        })
        timeSlots.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        return timeSlots
      }),
      catchError(err => {
        this.errorHandlerService.handleError(err)
        return of(null)
      })
    )
  }

  getUserSchedulesForMonth(month: number, year: number, currentUser: User): Observable<TimeSlot[]> {
    const userID = currentUser.uid;
    const userRole = currentUser.role;

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    if (userRole === 'patient') {
      return this.afs
        .collection('schedules')
        .snapshotChanges()
        .pipe(
          map((docs) => {
            const timeSlots: TimeSlot[] = [];
            docs.forEach((doc) => {
              const schedule = doc.payload.doc.data() as any;
              schedule.timeSlots.forEach((slot: TimeSlot) => {
                const slotStartDate = new Date(slot.startTime)
                if (
                  slot.bookerID === userID &&
                  slotStartDate.getMonth() === startOfMonth.getMonth() &&
                  slotStartDate.getFullYear() === startOfMonth.getFullYear()
                ) {
                  timeSlots.push(slot);
                }
              });
            });
            return timeSlots;
          })
        );
    } else if (userRole === 'doctor') {
      return this.afs
        .collection('schedules')
        .doc(userID)
        .valueChanges()
        .pipe(
          map((schedule: any) => {
            const timeSlots = schedule?.timeSlots || [];
            return timeSlots.filter((slot: TimeSlot) => {
              return new Date(slot.startTime) >= startOfMonth && new Date(slot.startTime) <= endOfMonth;
            });
          })
        );
    }

    return of([]);
  }
}
