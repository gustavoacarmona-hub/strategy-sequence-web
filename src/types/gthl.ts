export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AskRequest {
  question: string;
}

export interface AskResponse {
  answer: string;
  error?: string;
}

export interface FeedbackRequest {
  question: string;
  answer: string;
  helpful: boolean;
  comment?: string;
}

export interface DailyCount {
  deviceCount: number;
  lastReset: string;
}
