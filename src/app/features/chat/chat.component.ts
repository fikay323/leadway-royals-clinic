import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../../shared/services/auth.service';
import { ChatService } from '../../shared/services/chat.service';
import { User } from '../../shared/models/user.model';
import { Chat, Message, Participant } from '../../shared/models/chat.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  user: User = null;
  user$: Observable<User> = this.authService.user$;

  chats: Chat[] = [];
  messages: Message[] = [];
  selectedChat: Chat | null = null;
  messageContent: string = '';

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user$.subscribe(user => {
      this.user = user;
      this.getUserChats();
    });
  }

  getUserChats(): void {
    this.chatService.getUserChats(this.user.uid).subscribe(chats => {
      this.chats = chats;
    });
  }

  selectChat(chat: Chat): void {
    this.selectedChat = chat;
    this.getMessagesForChat(chat.chatID);
  }

  getMessagesForChat(chatID: string): void {
    this.chatService.getMessagesForChat(chatID).subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage(): void {
    if (this.selectedChat && this.messageContent.trim()) {
      this.chatService.sendMessage(this.selectedChat.chatID, this.user.uid, this.messageContent).subscribe(() => {
        this.messageContent = '';
      });
    }
  }

  getDisplayName(participant: Participant): string {
    if (participant.isDoctor) {
      return `Dr. ${participant.firstName.charAt(0)}. ${participant.lastName}`;
    } else {
      return `Patient ${participant.firstName.charAt(0)}. ${participant.lastName}`;
    }
  }
}

