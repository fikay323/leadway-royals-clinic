// src/app/services/chat.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Chat, Message, Participant } from '../models/chat.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private afs: AngularFirestore,
    private errorHandlerService: ErrorHandlerService
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
      chatsCollection.ref.where('participants', 'array-contains', doctorID).get()
    ).pipe(
      switchMap((querySnapshot) => {
        const existingChat = querySnapshot.docs.find((doc) => {
          const data = doc.data() as Chat;
          return data.participants.some((p) => p.id === patientID);
        });

        console.log(existingChat)

        if (existingChat) {
          // Chat exists, return the existing chat ID
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
            lastMessageTimestamp: new Date(),
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
      sentAt: new Date(),
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
    console.log(userID)
    return this.afs.collection<Chat>('chats', ref => ref.where('participantIDs', 'array-contains', userID)).valueChanges().pipe(
      tap(res => {
        console.log(res)
      })
    )
  }

  getMessagesForChat(chatID: string): Observable<Message[]> {
    return this.afs.collection<Message>(`chats/${chatID}/messages`, ref => ref.orderBy('sentAt', 'asc')).valueChanges();
  }

  sendMessage(chatID: string, senderID: string, content: string): Observable<void> {
    const message: Message = {
      messageID: this.afs.createId(),
      chatID,
      senderID,
      content,
      sentAt: new Date(),
      isRead: false,
    };

    return from(this.afs.collection(`chats/${chatID}/messages`).doc(message.messageID).set(message));
  }
}
