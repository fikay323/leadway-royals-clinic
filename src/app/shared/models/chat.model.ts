export interface Participant {
    id: string;
    isDoctor: boolean; // True if the participant is a doctor
    // Add other relevant properties if necessary
    firstName: string;
    lastName: string;
  }
  
  export interface Message {
    content: string;
    senderID: string;
    messageID: string;
    sentAt: Date;
  }
  
  export interface Chat {
    chatID: string;
    participants: Participant[];
    lastMessage?: string;
    lastMessageTimestamp?: Date; // Optional, for tracking the last message time
    createdAt: Date;
  }
  