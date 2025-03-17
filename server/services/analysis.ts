import { readFileSync } from 'fs';
import { Analysis, TimeAnalysisType, Participant, TopicAnalysis, SentimentAnalysis } from '../types';
import { Chart } from 'chart.js';

interface Message {
  timestamp: Date;
  sender: string;
  content: string;
}

export async function analyzeChat(input: string): Promise<Analysis> {
  try {
    const messages = parseWhatsAppChat(input);
    
    const analysis: Analysis = {
      messageCount: messages.length,
      participants: getParticipantStats(messages),
      timeAnalysis: getTimeAnalysis(messages),
      topWords: getTopWords(messages),
      sentiment: await analyzeSentiment(messages),
      topics: await analyzeTopics(messages)
    };

    return analysis;
  } catch (error) {
    console.error('Error analyzing chat:', error);
    throw new Error('Failed to analyze chat');
  }
}

function parseWhatsAppChat(content: string): Message[] {
  const lines = content.split('\n');
  const messages: Message[] = [];
  const messageRegex = /\[?(\d{1,2}\/\d{1,2}\/\d{2,4},?\s*\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\]?\s*[-:]\s*([^:]+):\s*(.+)/;

  for (const line of lines) {
    const match = line.match(messageRegex);
    if (match) {
      const [, timestamp, sender, content] = match;
      messages.push({
        timestamp: new Date(timestamp),
        sender: sender.trim(),
        content: content.trim()
      });
    }
  }

  return messages;
}

function getParticipantStats(messages: Message[]) {
  const stats = new Map<string, number>();
  
  messages.forEach(msg => {
    stats.set(msg.sender, (stats.get(msg.sender) || 0) + 1);
  });

  return Array.from(stats.entries()).map(([name, count]) => ({
    name,
    messageCount: count,
    percentage: (count / messages.length) * 100
  }));
}

function getTimeAnalysis(messages: Message[]) {
  const hourlyActivity = new Array(24).fill(0);
  const dailyActivity = new Array(7).fill(0);

  messages.forEach(msg => {
    const date = msg.timestamp;
    hourlyActivity[date.getHours()]++;
    dailyActivity[date.getDay()]++;
  });

  return {
    hourlyActivity,
    dailyActivity,
    totalDays: Math.ceil((messages[messages.length - 1].timestamp.getTime() - messages[0].timestamp.getTime()) / (1000 * 60 * 60 * 24))
  };
}

function getTopWords(messages: Message[], limit: number = 100) {
  const wordCounts = new Map<string, number>();
  const stopWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at']);

  messages.forEach(msg => {
    const words = msg.content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

    words.forEach(word => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });
  });

  return Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

async function analyzeSentiment(messages: Message[]) {
  // Simple sentiment analysis using word matching
  const positiveWords = new Set(['happy', 'great', 'good', 'love', 'awesome', 'excellent', 'thank', 'thanks', 'nice', 'wonderful']);
  const negativeWords = new Set(['bad', 'hate', 'terrible', 'awful', 'horrible', 'sorry', 'sad', 'upset', 'angry', 'unfortunate']);

  let positive = 0;
  let negative = 0;
  let neutral = 0;

  messages.forEach(msg => {
    const words = msg.content.toLowerCase().split(/\s+/);
    const posCount = words.filter(word => positiveWords.has(word)).length;
    const negCount = words.filter(word => negativeWords.has(word)).length;

    if (posCount > negCount) positive++;
    else if (negCount > posCount) negative++;
    else neutral++;
  });

  return {
    positive: (positive / messages.length) * 100,
    negative: (negative / messages.length) * 100,
    neutral: (neutral / messages.length) * 100
  };
}

async function analyzeTopics(messages: Message[]) {
  // Simple topic analysis using keyword matching
  const topics = {
    work: ['meeting', 'project', 'deadline', 'work', 'office'],
    social: ['party', 'dinner', 'lunch', 'meet', 'hangout'],
    family: ['mom', 'dad', 'sister', 'brother', 'family'],
    entertainment: ['movie', 'game', 'play', 'watch', 'music'],
    travel: ['trip', 'travel', 'vacation', 'flight', 'hotel']
  };

  const topicCounts = new Map<string, number>();

  messages.forEach(msg => {
    const content = msg.content.toLowerCase();
    
    Object.entries(topics).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => content.includes(keyword))) {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      }
    });
  });

  return Array.from(topicCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([topic, count]) => ({
      topic,
      count,
      percentage: (count / messages.length) * 100
    }));
} 