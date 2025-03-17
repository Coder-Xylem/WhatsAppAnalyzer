// Analysis related types
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantSentiment {
  positive: number;
  negative: number;
  neutral: number;
  overall: string;
}

export interface Participant {
  name: string;
  messageCount: number;
  wordCount: number;
  percentage: number;
  sentiment: {
    overall: string;
  };
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
  timeline: Array<{
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }>;
}

export interface TimeAnalysis {
  hourlyActivity: number[];
  dailyActivity: number[];
  totalDays: number;
}

export interface TopWord {
  word: string;
  count: number;
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
  id: string;
  messageCount: number;
  sentiment: Sentiment;
  participants: Participant[];
  topics: Topic;
  topWords: CommonWord[];
}

export interface AnalysisSummary {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  messageCount: number;
  participantCount: number;
}

export interface ApiError {
  message: string;
  status: number;
}
