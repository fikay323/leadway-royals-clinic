// booking.service.ts
import { Injectable } from '@angular/core';
import { MessagingService } from './messaging.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of, switchMap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(
    private messagingService: MessagingService,
    private afs: AngularFirestore
  ) {}

  bookAppointment(doctorID: string, patientID: string) {
    // Get doctor and patient FCM tokens from Firestore
    const doctorToken$ = this.afs.collection<any>('users').doc(doctorID).get().pipe(
      switchMap((doc) => {
        const data = doc.data();
        return of(data?.fcmToken); // Return the doctor's FCM token
      })
    );

    const patientToken$ = this.afs.collection<any>('users').doc(patientID).get().pipe(
      switchMap((doc) => {
        const data = doc.data();
        return of(data?.fcmToken); // Return the patient's FCM token
      })
    );

    // Send notifications to both doctor and patient after booking
    doctorToken$.subscribe((doctorToken) => {
      if (doctorToken) {
        this.messagingService.sendPushNotification(
          doctorToken,
          'New Appointment!',
          'You have a new appointment.'
        ).subscribe();
      }
    });

    patientToken$.subscribe((patientToken) => {
      if (patientToken) {
        this.messagingService.sendPushNotification(
          patientToken,
          'Appointment Booked!',
          'Your appointment has been confirmed.'
        ).subscribe();
      }
    });
  }
}
