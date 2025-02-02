// src/app/services/chat.service.ts

import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, from, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Chat, Message } from '../models/chat.model';
import { ErrorHandlerService } from './error-handler.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnDestroy {
  private destroy$ = new Subject<void>()
  constructor(
    private afs: AngularFirestore,
    private errorHandlerService: ErrorHandlerService,
    private firestoreService: FirestoreService
  ) {}

  initializeChat(
    doctorID: string,
    patientID: string,
    doctorName: { firstName: string; lastName: string },
    patientName: { firstName: string; lastName: string },
    initialMessage: string
  ): Observable<string> {
    const chatsCollection = this.afs.collection<Chat>('chats');

    return from(
      chatsCollection.ref.where('participantIDs', 'array-contains', doctorID).get()
    ).pipe(
      switchMap((querySnapshot) => {
        const existingChat = querySnapshot.docs.find((doc) => {
          const data = doc.data() as Chat;
          return data.participantIDs.includes(patientID);
        });

        console.log(existingChat)

        if (existingChat) {
          return of(existingChat.id);
        } else {
          // Create a new chat
          const newChatID = this.afs.createId(); // Generate a new chat ID

          const newChat: Chat = {
            chatID: newChatID,
            participants: [
              {
                id: doctorID,
                firstName: doctorName.firstName,
                lastName: doctorName.lastName,
                isDoctor: true,
              },
              {
                id: patientID,
                firstName: patientName.firstName,
                lastName: patientName.lastName,
                isDoctor: false,
              },
            ],
            participantIDs: [doctorID, patientID],
            createdAt: new Date(),
            lastMessage: initialMessage,
            lastMessageTimestamp: new Date().toISOString(),
          };

          // Add the new chat document
          return from(chatsCollection.doc(newChatID).set(newChat)).pipe(
            switchMap(() =>
              this.addMessageToChat(newChatID, patientID, initialMessage)
            ),
            map(() => newChatID) // Return the new chat ID
          );
        }
      }),
      catchError((err) => {
        this.errorHandlerService.handleError(err);
        return of(null);
      })
    );
  }

  addMessageToChat(chatID: string, senderID: string, content: string): Observable<void> {
    const messagesCollection = this.afs.collection<Message>(`chats/${chatID}/messages`);

    const newMessage: Message = {
      messageID: this.afs.createId(),
      chatID,
      senderID,
      content,
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    return from(messagesCollection.doc(newMessage.messageID).set(newMessage)).pipe(
      catchError((err) => {
        this.errorHandlerService.handleError(err);
        return of(null);
      })
    );
  }

  getUserChats(userID: string): Observable<Chat[]> {
    return this.firestoreService.listenToCollection<Chat>('chats', ref => ref.where('participantIDs', 'array-contains', userID)).pipe(takeUntil(this.destroy$))
  }

  getMessagesForChat(chatID: string): Observable<Message[]> {
    return this.firestoreService.listenToCollection<Message>(`chats/${chatID}/messages`, ref => ref.orderBy('sentAt', 'asc')).pipe(takeUntil(this.destroy$))
  }

  sendMessage(
    chatID: string,
    senderID: string,
    content: string
  ): Observable<void> {
    const message: Message = {
      messageID: this.afs.createId(),
      chatID,
      senderID,
      content,
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    const messagesCollection = this.afs.collection<Message>(
      `chats/${chatID}/messages`
    );

    // Add the message to the messages sub-collection
    return from(messagesCollection.doc(message.messageID).set(message)).pipe(
      switchMap(() => {
        // Update the parent chat document with the last message and timestamp
        return this.afs
          .collection<Chat>('chats')
          .doc(chatID)
          .update({
            lastMessage: content,
            lastMessageTimestamp: new Date().toISOString(),
          });
      }),
      catchError((err) => {
        this.errorHandlerService.handleError(err);
        return of(null);
      })
    );
  }

  ngOnDestroy() {
    this.destroy$.next(); // Emit to complete all subscriptions
    this.destroy$.complete(); // Complete the Subject
  }
}
