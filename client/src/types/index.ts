
export interface Content {
  text: string;
  emoji: string;
}

export interface UserMessage {
  id: string;
  role: 'user';
  content: string;
}

export interface AssistantMessage {
  id: string;
  role: 'assistant';
  content: Content;
}

export type Message = AssistantMessage | UserMessage
