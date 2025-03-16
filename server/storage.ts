import { users, type User, type InsertUser, analyses, type Analysis, type InsertAnalysis } from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import session from "express-session";
import connectPg from "connect-pg-simple";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Analysis methods
  getAnalysis(id: number): Promise<Analysis | undefined>;
  getAnalysesByUserId(userId: number): Promise<Analysis[]>;
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  
  // Session store for express-session
  sessionStore: session.Store;
}

// Database setup
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString!);
const db = drizzle(client);

const PostgresSessionStore = connectPg(session);

export class PostgresStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values({
        ...insertUser,
        name: insertUser.name || null,
        picture: insertUser.picture || null
      }).returning();
      
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Analysis methods
  async getAnalysis(id: number): Promise<Analysis | undefined> {
    try {
      const result = await db.select().from(analyses).where(eq(analyses.id, id));
      return result[0];
    } catch (error) {
      console.error('Error getting analysis:', error);
      return undefined;
    }
  }

  async getAnalysesByUserId(userId: number): Promise<Analysis[]> {
    try {
      return await db.select().from(analyses).where(eq(analyses.userId, userId));
    } catch (error) {
      console.error('Error getting analyses by user ID:', error);
      return [];
    }
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    try {
      const result = await db.insert(analyses).values({
        ...insertAnalysis,
        uploadDate: insertAnalysis.uploadDate || new Date()
      }).returning();
      
      return result[0];
    } catch (error) {
      console.error('Error creating analysis:', error);
      throw error;
    }
  }
}

// Fall back to memory storage if database URL is not available
import createMemoryStore from "memorystore";
const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private analyses: Map<number, Analysis>;
  private userIdCounter: number;
  private analysisIdCounter: number;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.analyses = new Map();
    this.userIdCounter = 1;
    this.analysisIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id,
      name: insertUser.name || null,
      picture: insertUser.picture || null
    };
    this.users.set(id, user);
    return user;
  }

  // Analysis methods
  async getAnalysis(id: number): Promise<Analysis | undefined> {
    return this.analyses.get(id);
  }

  async getAnalysesByUserId(userId: number): Promise<Analysis[]> {
    return Array.from(this.analyses.values()).filter(
      (analysis) => analysis.userId === userId,
    );
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = this.analysisIdCounter++;
    const analysis: Analysis = { 
      ...insertAnalysis, 
      id,
      uploadDate: insertAnalysis.uploadDate || new Date()
    };
    this.analyses.set(id, analysis);
    return analysis;
  }
}

// Create the appropriate storage implementation based on environment
export const storage = process.env.DATABASE_URL 
  ? new PostgresStorage() 
  : new MemStorage();
