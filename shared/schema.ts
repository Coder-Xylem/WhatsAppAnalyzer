import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model (Auth0 users)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  auth0Id: text("auth0_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  picture: text("picture"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Analyses model to store chat analysis results
export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadDate: timestamp("upload_date").notNull().defaultNow(),
  totalMessages: integer("total_messages").notNull(),
  participants: jsonb("participants").notNull(),
  sentiment: jsonb("sentiment").notNull(),
  topics: jsonb("topics").notNull(),
  commonWords: jsonb("common_words").notNull(),
  rawData: jsonb("raw_data").notNull(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
});

// Define zod schema for participant data
export const participantSchema = z.object({
  name: z.string(),
  messages: z.number(),
  words: z.number(),
  sentiment: z.object({
    positive: z.number(),
    negative: z.number(),
    neutral: z.number(),
    overall: z.string(),
  }),
});

// Define zod schema for sentiment data
export const sentimentSchema = z.object({
  positive: z.number(),
  negative: z.number(),
  neutral: z.number(),
  timeline: z.array(z.object({
    date: z.string(),
    positive: z.number(),
    negative: z.number(),
    neutral: z.number(),
  })),
});

// Define zod schema for topic data
export const topicSchema = z.object({
  distribution: z.record(z.string(), z.number()),
});

// Define zod schema for common words
export const commonWordSchema = z.object({
  text: z.string(),
  count: z.number(),
  size: z.number().optional(),
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Participant = z.infer<typeof participantSchema>;
export type Sentiment = z.infer<typeof sentimentSchema>;
export type Topic = z.infer<typeof topicSchema>;
export type CommonWord = z.infer<typeof commonWordSchema>;
