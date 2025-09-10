
export enum Role {
  USER = "user",
  MODEL = "model",
}

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

export enum Language {
  EN = "en",
  TA = "ta",
}

export interface ChatMessagePart {
  text: string;
}

export interface ChatMessage {
  id?: number;
  role: Role;
  parts: ChatMessagePart[];
  image?: string;
  timestamp: Date;
  isError?: boolean;
}