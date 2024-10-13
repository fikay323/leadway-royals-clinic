import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  constructor(private afMessaging: AngularFireMessaging) {}

  requestPermission() {
    this.afMessaging.requestToken.subscribe(
      (token) => {
        console.log('Notification permission granted. Token:', token);
        // Save the token to Firestore or your backend
      },
      (error) => {
        console.error('Unable to get permission to notify.', error);
      }
    );
  }

  listenForMessages() {
    this.afMessaging.messages.subscribe((message) => {
      console.log('New message:', message);
    });
  }
}
