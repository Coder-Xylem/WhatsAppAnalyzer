export interface Analysis {
  messageCount: number;
  participants: ParticipantStats[];
  timeAnalysis: TimeAnalysis;
  topWords: WordCount[];
  sentiment: SentimentAnalysis;
  topics: TopicAnalysis[];
}

export interface ParticipantStats {
  name: string;
  messageCount: number;
  percentage: number;
}

export interface TimeAnalysis {
  hourlyActivity: number[];
  dailyActivity: number[];
  totalDays: number;
}

export interface WordCount {
  word: string;
  count: number;
}

export interface SentimentAnalysis {
  positive: number;
  negative: number;
  neutral: number;
}

export interface TopicAnalysis {
  topic: string;
  count: number;
  percentage: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface AuthError {
  message: string;
} 