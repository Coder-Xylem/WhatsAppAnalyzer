import { Sentiment, Participant, Topic, CommonWord } from "@shared/schema";
import natural from "natural";

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const TfIdf = natural.TfIdf;
const afinn = new natural.SentimentAnalyzer("English", stemmer, "afinn");

// Message structure from WhatsApp chat exports
interface Message {
  date: string;
  time: string;
  sender: string;
  content: string;
}

// Parse WhatsApp chat text format
export function parseWhatsAppChat(text: string): Message[] {
  const lines = text.split('\n');
  const messages: Message[] = [];
  const dateTimePattern = /\[?(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{1,2}(?::\d{1,2})?(?:\s*[APap][Mm])?)?\]?\s+(.+?):\s+(.+)/;

  let currentMessage: Message | null = null;
  
  for (const line of lines) {
    const match = line.match(dateTimePattern);
    if (match) {
      if (currentMessage) {
        messages.push(currentMessage);
      }
      
      const [, date, time, sender, content] = match;
      currentMessage = {
        date,
        time: time || "",
        sender,
        content
      };
    } else if (currentMessage) {
      // Continuation of previous message
      currentMessage.content += "\n" + line;
    }
  }
  
  if (currentMessage) {
    messages.push(currentMessage);
  }
  
  return messages;
}

// Analyze sentiment of a message
function analyzeSentiment(text: string) {
  const words = tokenizer.tokenize(text.toLowerCase()) || [];
  
  // Filter out noise and non-words
  const filteredWords = words.filter(word => word.length > 1);
  
  if (filteredWords.length === 0) return "neutral";
  
  // Get sentiment score using natural's SentimentAnalyzer
  const score = afinn.getSentiment(filteredWords);
  
  if (score > 0.05) return "positive";
  if (score < -0.05) return "negative";
  return "neutral";
}

// Get sentiment counts
function getSentimentCounts(messages: Message[]): { positive: number; negative: number; neutral: number } {
  let positive = 0;
  let negative = 0;
  let neutral = 0;
  
  for (const message of messages) {
    const sentiment = analyzeSentiment(message.content);
    if (sentiment === "positive") positive++;
    else if (sentiment === "negative") negative++;
    else neutral++;
  }
  
  return { positive, negative, neutral };
}

// Get sentiment timeline
function getSentimentTimeline(messages: Message[]): Sentiment["timeline"] {
  const timeline: Map<string, { positive: number; negative: number; neutral: number }> = new Map();
  
  for (const message of messages) {
    if (!timeline.has(message.date)) {
      timeline.set(message.date, { positive: 0, negative: 0, neutral: 0 });
    }
    
    const sentiment = analyzeSentiment(message.content);
    const entry = timeline.get(message.date)!;
    
    if (sentiment === "positive") entry.positive++;
    else if (sentiment === "negative") entry.negative++;
    else entry.neutral++;
  }
  
  return Array.from(timeline.entries()).map(([date, counts]) => ({
    date,
    ...counts
  }));
}

// Extract topics from messages
function extractTopics(messages: Message[]): Topic {
  const tfidf = new TfIdf();
  
  // Add documents to TF-IDF
  messages.forEach(message => {
    tfidf.addDocument(message.content);
  });
  
  // Define topic categories and their related terms
  const topicCategories: Record<string, string[]> = {
    "Work": ["work", "project", "meeting", "deadline", "client", "job", "task", "office"],
    "Social": ["party", "meet", "lunch", "dinner", "drink", "friend", "weekend", "fun"],
    "Planning": ["schedule", "plan", "event", "organize", "time", "date", "arrange"],
    "Personal": ["family", "home", "health", "feeling", "love", "care", "life"],
    "Travel": ["trip", "vacation", "flight", "hotel", "visit", "tour", "travel"],
    "Technology": ["phone", "app", "computer", "tech", "software", "device", "internet"]
  };
  
  // Calculate topic scores
  const topicScores: Record<string, number> = {};
  
  Object.entries(topicCategories).forEach(([topic, keywords]) => {
    let topicScore = 0;
    
    keywords.forEach(keyword => {
      tfidf.tfidfs(keyword, (i, measure) => {
        topicScore += measure;
      });
    });
    
    topicScores[topic] = topicScore;
  });
  
  // Normalize scores to percentages
  const total = Object.values(topicScores).reduce((sum, score) => sum + score, 0);
  const distribution = Object.fromEntries(
    Object.entries(topicScores).map(([topic, score]) => [
      topic, 
      total > 0 ? Math.round((score / total) * 100) : 0
    ])
  );
  
  return { distribution };
}

// Extract most common words
function extractCommonWords(messages: Message[]): CommonWord[] {
  const wordCounts: Record<string, number> = {};
  const stopWords = new Set([
    "the", "a", "an", "and", "is", "in", "it", "to", "of", "for", "with", 
    "on", "at", "from", "by", "about", "as", "into", "like", "through", 
    "after", "over", "between", "out", "against", "during", "without", 
    "before", "under", "around", "among"
  ]);
  
  // Add WhatsApp placeholder words to the stop list
  const whatsAppPlaceholders = new Set([
    "omitted", "media", "deleted", "message", "audio", "video", "image", "sticker",
    "this", "was", "you", "your", "have", "has", "had", "will", "would", "i'm", "im"
  ]);
  
  messages.forEach(message => {
    const words = tokenizer.tokenize(message.content.toLowerCase()) || [];
    
    words.forEach(word => {
      // Filter out short words, numbers, stop words, and WhatsApp placeholders
      if (word.length > 2 && 
          !stopWords.has(word) && 
          !whatsAppPlaceholders.has(word) && 
          !/^\d+$/.test(word) &&
          !message.content.toLowerCase().includes('media omitted') &&
          !message.content.toLowerCase().includes('message deleted')) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
  });
  
  // Sort by frequency and take top 30
  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([text, count]) => ({ text, count }));
  
  // Calculate font size based on frequency (between 16px and 28px)
  const min = Math.min(...sortedWords.map(w => w.count));
  const max = Math.max(...sortedWords.map(w => w.count));
  const range = max - min || 1;
  
  return sortedWords.map(word => ({
    ...word,
    size: 16 + Math.floor(((word.count - min) / range) * 12)
  }));
}

// Analyze participants
function analyzeParticipants(messages: Message[]): Participant[] {
  const participants: Record<string, {
    messages: number;
    words: number;
    sentiments: { positive: number; negative: number; neutral: number };
  }> = {};
  
  messages.forEach(message => {
    const { sender, content } = message;
    
    if (!participants[sender]) {
      participants[sender] = {
        messages: 0,
        words: 0,
        sentiments: { positive: 0, negative: 0, neutral: 0 }
      };
    }
    
    const words = tokenizer.tokenize(content) || [];
    const sentiment = analyzeSentiment(content);
    
    participants[sender].messages++;
    participants[sender].words += words.length;
    
    if (sentiment === "positive") participants[sender].sentiments.positive++;
    else if (sentiment === "negative") participants[sender].sentiments.negative++;
    else participants[sender].sentiments.neutral++;
  });
  
  return Object.entries(participants).map(([name, data]) => {
    const { messages, words, sentiments } = data;
    const { positive, negative, neutral } = sentiments;
    const total = positive + negative + neutral;
    
    let overall = "neutral";
    if (total > 0) {
      const positivePercent = (positive / total) * 100;
      const negativePercent = (negative / total) * 100;
      
      if (positivePercent > 60) overall = "positive";
      else if (negativePercent > 60) overall = "negative";
    }
    
    return {
      name,
      messages,
      words,
      sentiment: {
        positive: Math.round((positive / total) * 100) || 0,
        negative: Math.round((negative / total) * 100) || 0,
        neutral: Math.round((neutral / total) * 100) || 0,
        overall
      }
    };
  });
}

// Main analysis function
export async function analyzeChat(chatText: string) {
  const messages = parseWhatsAppChat(chatText);
  
  if (messages.length === 0) {
    throw new Error("No valid messages found in the chat");
  }
  
  // Get sentiment analysis
  const sentimentCounts = getSentimentCounts(messages);
  const timeline = getSentimentTimeline(messages);
  const totalMessages = messages.length;
  
  // Calculate sentiment percentages
  const sentiment = {
    ...sentimentCounts,
    positive: Math.round((sentimentCounts.positive / totalMessages) * 100),
    negative: Math.round((sentimentCounts.negative / totalMessages) * 100),
    neutral: Math.round((sentimentCounts.neutral / totalMessages) * 100),
    timeline
  };
  
  // Get participant analysis
  const participants = analyzeParticipants(messages);
  
  // Get topic analysis
  const topics = extractTopics(messages);
  
  // Get common words
  const commonWords = extractCommonWords(messages);
  
  return {
    totalMessages,
    participants,
    sentiment,
    topics,
    commonWords,
    rawData: messages
  };
}
