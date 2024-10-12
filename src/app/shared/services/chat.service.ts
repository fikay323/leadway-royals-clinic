// src/app/shared/services/chat.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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

  // Initialize chat with doctor and patient names
  initializeChat(
    doctorID: string,
    patientID: string,
    doctorName: { firstName: string; lastName: string; },
    patientName: { firstName: string; lastName: string; },
    initialMessage: string
  ): Observable<string> {
    const chatsCollection = this.afs.collection<Chat>('chats');

    return from(chatsCollection.ref.where('participants', 'array-contains', doctorID).get()).pipe(
      switchMap(querySnapshot => {
        const existingChat = querySnapshot.docs.find(doc => {
          const data = doc.data() as Chat;
          return data.participants.some(p => p.id === patientID);
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
            createdAt: new Date(),
            lastMessage: initialMessage,
            lastMessageTimestamp: new Date(),
          };

          // Add the new chat document
          return from(chatsCollection.doc(newChatID).set(newChat)).pipe(
            switchMap(() => this.addMessageToChat(newChatID, patientID, initialMessage)),
            map(() => newChatID) // Return the new chat ID
          );
        }
      }),
      catchError(err => {
        this.errorHandlerService.handleError(err);
        return of(null);
      })
    );
  }

  // Send message to a chat
  sendMessage(chatID: string, content: string, senderID: string): Observable<void> {
    const message: Message = {
      messageID: this.afs.createId(),
      senderID: senderID,
      content: content,
      sentAt: new Date(),
    };

    return from(this.afs.collection(`chats/${chatID}/messages`).doc(message.messageID).set(message)).pipe(
      catchError(err => {
        this.errorHandlerService.handleError(err);
        return of(undefined); // Return undefined on error
      })
    );
  }

  // Get user chats
  getUserChats(userID: string): Observable<Chat[]> {
    console.log(userID)
    return this.afs.collection<Chat>('chats', ref => ref.where('participants', 'array-contains', userID)).valueChanges().pipe(
      tap(res => {
        console.log(res)
      })
    );
  }

  // Get messages for a specific chat
  getMessagesForChat(chatID: string): Observable<Message[]> {
    console.log(chatID)
    return this.afs.collection<Message>(`chats/${chatID}/messages`, ref => ref.orderBy('sentAt', 'asc')).valueChanges().pipe(
      tap(res => {
        console.log(res)
      })
    )
  }

  // Add message to chat
  addMessageToChat(chatID: string, senderID: string, content: string): Observable<void> {
    const messagesCollection = this.afs.collection<Message>(`chats/${chatID}/messages`);

    const newMessage: Message = {
      messageID: this.afs.createId(),
      senderID: senderID,
      content: content,
      sentAt: new Date(),
    };

    return from(messagesCollection.doc(newMessage.messageID).set(newMessage)).pipe(
      catchError(err => {
        this.errorHandlerService.handleError(err);
        return of(undefined); // Return undefined on error
      })
    );
  }
}
