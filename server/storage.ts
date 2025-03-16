import { users, type User, type InsertUser, analyses, type Analysis, type InsertAnalysis } from "@shared/schema";

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
  sessionStore: any;
}

import createMemoryStore from "memorystore";
import session from "express-session";

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

export const storage = new MemStorage();
