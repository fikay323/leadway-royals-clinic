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
  
  chatID: string;
  chat: Chat;
  messages: any[] = [];
  newMessage: string = '';
  doctor: Participant;
  chats$: Observable<Chat[]>;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user$.subscribe(user => {
      this.user = user;
      this.chats$ = this.chatService.getUserChats(user.uid)
    });
    this.chats$.subscribe()
  }
  selectedChat: Chat | null = null;


  selectChat(chat: Chat) {
    this.selectedChat = chat;
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedChat) {
      this.chatService.sendMessage(this.selectedChat.chatID, this.newMessage).subscribe(() => {
        this.newMessage = ''; // Clear input
      });
    }
  }
}
