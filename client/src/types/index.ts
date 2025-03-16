// Auth0 related types
export interface Auth0User {
  sub: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
}

// Analysis related types
export interface User {
  id: number;
  auth0Id: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface ParticipantSentiment {
  positive: number;
  negative: number;
  neutral: number;
  overall: string;
}

export interface Participant {
  name: string;
  messages: number;
  words: number;
  sentiment: ParticipantSentiment;
}

export interface SentimentTimelineEntry {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface Sentiment {
  positive: number;
  negative: number;
  neutral: number;
  timeline: SentimentTimelineEntry[];
}

export interface Topic {
  distribution: Record<string, number>;
}

export interface CommonWord {
  text: string;
  count: number;
  size?: number;
}

export interface Analysis {
  id: number;
  userId: number;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  totalMessages: number;
  participants: Participant[];
  sentiment: Sentiment;
  topics: Topic;
  commonWords: CommonWord[];
}

export interface AnalysisSummary {
  id: number;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  totalMessages: number;
}
