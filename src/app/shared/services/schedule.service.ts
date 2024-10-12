import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; 
import { catchError, forkJoin, from, map, Observable, of, switchMap, tap } from 'rxjs';

import { ErrorHandlerService } from './error-handler.service';
import { User } from '../models/user.model';
import { NotificationService } from './notification.service';

export interface TimeSlot { 
  startTime: string;        // Start time of the slot in ISO format (e.g., '2024-10-10T09:00:00Z')
  endTime: string;          // End time of the slot in ISO format (e.g., '2024-10-10T10:00:00Z')
  bookerID: string;
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
  

  constructor(private afs: AngularFirestore, private errorHandlerService: ErrorHandlerService, private notificationService: NotificationService) {}

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

    // Use arrayUnion to add the new timeSlot to the timeSlots array
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

  // filterTimeSlotsByBookerID(currentUserUID: string): Observable<void> {
  //   // Reference to the schedules collection
  //   const schedulesCollectionRef = this.afs.collection('schedules');

  //   // Fetch all schedules
  //   return schedulesCollectionRef.get().pipe(
  //     map(querySnapshot => {
  //       // Map over each document in the collection
  //       const batch = this.afs.firestore.batch(); // Use a batch write to update multiple docs
  //       querySnapshot.docs.forEach(doc => {
  //         const schedule = doc.data() as IndividualDoctorSchedule;
          
  //         if (schedule.timeSlots && schedule.timeSlots.length > 0) {
  //           // Filter the timeSlots array to remove those with matching bookerID
  //           const updatedTimeSlots = schedule.timeSlots.filter(slot => slot.bookerID !== currentUserUID);

  //           // If there are changes, update the schedule with the new timeSlots array
  //           if (updatedTimeSlots.length !== schedule.timeSlots.length) {
  //             const scheduleDocRef = this.afs.collection('schedules').doc(schedule.doctorID).ref;
  //             batch.update(scheduleDocRef, { timeSlots: updatedTimeSlots });
  //           }
  //         }
  //       });

  //       // Commit the batch update
  //       return batch.commit(); // This returns a Promise<void>
  //     }),
  //     switchMap(batchCommitObservable => from(batchCommitObservable)), // Convert the Promise<void> to Observable<void>
  //     catchError(err => {
  //       this.errorHandlerService.handleError(err)
  //       return of(null)
  //     }),
  //     tap(res => {
  //       // this.notificationService.alertSuccess('Appointment cancelled successfully')
  //     }),
  //   )
  // }

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
}
