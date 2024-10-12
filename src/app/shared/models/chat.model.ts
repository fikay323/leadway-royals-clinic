// chat.model.ts
export interface Participant {
    firstName: string;
    lastName: string;
    id: string;
    isDoctor: boolean;
  }
  
  export interface Message {
    sender: string;
    text: string;
    timestamp: Date;
    isPatient: boolean; // true if the sender is a patient
  }
  
  export interface Chat {
    chatID: string;
    createdAt: Date;
    lastMessage: string;
    lastMessageTimestamp: Date;
    participants: Participant[];
    messages: Message[];
  }
  