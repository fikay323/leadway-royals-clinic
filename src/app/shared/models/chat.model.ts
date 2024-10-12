export interface Chat {
  chatID: string;
  participants: Participant[];
  createdAt: Date;
  lastMessage: string;
  lastMessageTimestamp: string;
  participantIDs: string[];
}

export interface Participant {
  id: string; // ID of the participant (doctor or patient)
  firstName: string; // First name of the participant
  lastName: string; // Last name of the participant
  isDoctor: boolean; // Indicates if the participant is a doctor
}

export interface Message {
  messageID: string;
  chatID: string;
  senderID: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}
