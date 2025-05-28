export type MessageType = 'CHAT' | 'JOIN' | 'LEAVE';

export interface BaseMessage {
  sender: string;
  timestamp: string;
}

export interface ChatTextMessage extends BaseMessage {
  type: 'CHAT';
  message: string;
}

export interface JoinMessage extends BaseMessage {
  type: 'JOIN';
}

export interface LeaveMessage extends BaseMessage {
  type: 'LEAVE';
}

export type ChatMessage = ChatTextMessage | JoinMessage | LeaveMessage;
