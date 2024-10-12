// src/app/shared/services/chat.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; 
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';

import { Chat, Message } from '../models/chat.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(
    private afs: AngularFirestore,
    private errorHandlerService: ErrorHandlerService
  ) { }

  initializeChat(doctorID: string, patientID: string, doctorName: { firstName: string; lastName: string }, patientName: { firstName: string; lastName: string }, initialMessage: string): Observable<void> {
    const chatID = this.afs.createId(); // Generate a unique chat ID
    const chat: Chat = {
      chatID: chatID,
      createdAt: new Date(),
      lastMessage: initialMessage,
      lastMessageTimestamp: new Date(),
      participants: [
        {
          firstName: doctorName.firstName,
          lastName: doctorName.lastName,
          id: doctorID,
          isDoctor: true
        },
        {
          firstName: patientName.firstName,
          lastName: patientName.lastName,
          id: patientID,
          isDoctor: false
        }
      ],
      messages: [{ sender: patientName.firstName, text: initialMessage, timestamp: new Date(), isPatient: true }]
    };

    return new Observable((observer) => {
      this.afs.collection('chats').doc(chatID).set(chat)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  createChat(chat: Chat): Observable<void> {
    return new Observable((observer) => {
      this.afs.collection('chats').doc(chat.chatID).set(chat)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  getChat(chatID: string): Observable<Chat> {
    return this.afs.collection('chats').doc<Chat>(chatID).valueChanges().pipe(
      tap(res => {
        console.log(res)
      })
    )
  }

  getAllChats(): Observable<Chat[]> {
    return this.afs.collection<Chat>('chats').valueChanges().pipe(
      tap(res => {
        console.log(res)
      })
    )
  }

  sendMessage(chatID: string, message: string): Observable<void> {
    const messageData = {
      text: message,
      timestamp: new Date()
    };
    
    return new Observable((observer) => {
      this.afs.collection('chats').doc(chatID).update({
        lastMessage: message,
        lastMessageTimestamp: new Date(),
        messages: firebase.firestore.FieldValue.arrayUnion(messageData)
      })
      .then(() => {
        observer.next();
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
    });
  }

  getUserChats(userId: string): Observable<Chat[]> {
    return this.afs.collection<Chat>('chats', ref => ref.where('participants', 'array-contains', userId)).valueChanges().pipe(
      tap(res => {
        console.log(res)
      })
    )
  }
}
