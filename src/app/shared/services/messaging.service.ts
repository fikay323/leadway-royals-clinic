// src/app/services/messaging.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { User } from '../models/user.model';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/environment';
import { getToken } from '@angular/fire/app-check';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  FCM_SERVER_KEY = environment.firebaseConfig.apiKey

  constructor(
    private afMessaging: AngularFireMessaging,
    private notificationService: NotificationService,
    private afs: AngularFirestore,
    private http: HttpClient
  ) {}

  requestPermission(user: User) {
    this.afMessaging.requestToken.subscribe({
      next: (token) => {
        console.log('Notification permission granted. Token:', token);
        // Store the FCM token in Firestore under the user's profile
        this.saveTokenToFirestore(user.uid, token);
      },
      error: (error) => {
        console.log(error)
        this.notificationService.alertError('Unable to get permission to notify.')
      }
    });
  }

  private saveTokenToFirestore(userID: string, token: string) {
    if (!token) return;

    this.afs
      .collection('users')
      .doc(userID)
      .update({ fcmToken: token })
      .then(() => {
        console.log('FCM token saved successfully.');
      })
      .catch((error) => {
        console.error('Error saving FCM token:', error);
      });
  }

  listenForMessages() {
    this.afMessaging.messages.subscribe((message) => {
      console.log('New message:', message);
    });
  }

  sendPushNotification(deviceToken: string, title: string, body: string) {
    const payload = {
      to: deviceToken,  // Send the message to this FCM token
      notification: {
        title: title,
        body: body,
        click_action: 'FLUTTER_NOTIFICATION_CLICK', // Adjust as per your app's routing
      },
    };

    console.log(payload)

    return this.http.post(`https://fcm.googleapis.com/fcm/send`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${this.FCM_SERVER_KEY}`,
      },
    }).pipe(
      catchError((error) => {
        console.error('Error sending push notification:', error);
        return of(null);
      })
    );
  }
}
