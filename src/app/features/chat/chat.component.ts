import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat, Message, Participant } from '../../shared/models/chat.model';
import { ChatService } from '../../shared/services/chat.service';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  user: User = null;
  user$: Observable<User> = this.authService.user$;
  chats$: Observable<Chat[]>; // Get all user chats
  selectedChat: Chat | null = null;
  messages$: Observable<Message[]> | null = null;
  messageContent: string = '';

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user$.subscribe(user => {
      this.user = user;
      this.loadUserChats();
    });
  }
  
  loadUserChats(): void {
    this.chats$ = this.chatService.getUserChats(this.user.uid); // Get chats for the current user
    this.chats$.subscribe(chat => {
      console.log(chat)
    })
  }
  
  selectChat(chat: Chat): void {
    this.selectedChat = chat; // Set selected chat
    this.loadMessages(chat.chatID); // Load messages for the selected chat
  }
  
  loadMessages(chatID: string): void {
    this.messages$ = this.chatService.getMessagesForChat(chatID)
  }

  sendMessage(): void {
    if (this.selectedChat && this.messageContent) {
      this.chatService.sendMessage(this.selectedChat.chatID, this.messageContent, this.user.uid).subscribe(() => {
        this.messageContent = ''; // Clear message input
      });
    }
  }

  getDisplayName(senderID: string): string {
    // Implement logic to return display name based on sender ID
    return senderID; // Placeholder, update this based on your logic
  }
}
