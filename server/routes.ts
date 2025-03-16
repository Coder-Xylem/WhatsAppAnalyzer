import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { setupAuth, ensureAuthenticated } from "./auth";
import { analyzeChat } from "./nlp";
import { generatePDF } from "./pdf";
import { insertAnalysisSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only .txt files
    if (file.mimetype === "text/plain" || file.originalname.endsWith(".txt")) {
      cb(null, true);
    } else {
      cb(new Error("Only .txt files are accepted"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Check authentication status
  app.get("/api/auth/status", (req, res) => {
    res.json({ 
      isAuthenticated: req.isAuthenticated(),
      user: req.isAuthenticated() ? req.user : null
    });
  });
  
  // Upload WhatsApp chat file and analyze
  app.post(
    "/api/upload",
    ensureAuthenticated,
    upload.single("file"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        
        const user = req.user;
        const file = req.file;
        const chatText = file.buffer.toString("utf-8");
        
        // Analyze chat
        const analysis = await analyzeChat(chatText);
        
        // Save analysis to database
        const savedAnalysis = await storage.createAnalysis({
          userId: user.id,
          fileName: file.originalname,
          fileSize: file.size,
          uploadDate: new Date(),
          totalMessages: analysis.totalMessages,
          participants: analysis.participants,
          sentiment: analysis.sentiment,
          topics: analysis.topics,
          commonWords: analysis.commonWords,
          rawData: analysis.rawData,
        });
        
        // Return the analysis ID and results
        res.json({
          id: savedAnalysis.id,
          totalMessages: analysis.totalMessages,
          participants: analysis.participants,
          sentiment: analysis.sentiment,
          topics: analysis.topics,
          commonWords: analysis.commonWords,
        });
      } catch (error: any) {
        console.error("Error analyzing chat:", error);
        res.status(500).json({ message: error.message || "Error analyzing chat" });
      }
    }
  );
  
  // Get user's analysis history
  app.get("/api/analyses", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      const analyses = await storage.getAnalysesByUserId(user.id);
      
      // Return only the necessary data for the list view
      res.json(
        analyses.map(analysis => ({
          id: analysis.id,
          fileName: analysis.fileName,
          fileSize: analysis.fileSize,
          uploadDate: analysis.uploadDate,
          totalMessages: analysis.totalMessages,
        }))
      );
    } catch (error: any) {
      console.error("Error fetching analyses:", error);
      res.status(500).json({ message: error.message || "Error fetching analyses" });
    }
  });
  
  // Get a specific analysis
  app.get("/api/analyses/:id", ensureAuthenticated, async (req, res) => {
    try {
      const analysisId = parseInt(req.params.id);
      const user = req.user;
      
      if (isNaN(analysisId)) {
        return res.status(400).json({ message: "Invalid analysis ID" });
      }
      
      const analysis = await storage.getAnalysis(analysisId);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      if (analysis.userId !== user.id) {
        return res.status(403).json({ message: "Unauthorized access to analysis" });
      }
      
      // Return analysis data without rawData to reduce payload size
      const { rawData, ...analysisData } = analysis;
      res.json(analysisData);
    } catch (error: any) {
      console.error("Error fetching analysis:", error);
      res.status(500).json({ message: error.message || "Error fetching analysis" });
    }
  });
  
  // Generate PDF for an analysis
  app.get("/api/analyses/:id/pdf", ensureAuthenticated, async (req, res) => {
    try {
      const analysisId = parseInt(req.params.id);
      const user = req.user;
      
      if (isNaN(analysisId)) {
        return res.status(400).json({ message: "Invalid analysis ID" });
      }
      
      const analysis = await storage.getAnalysis(analysisId);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      if (analysis.userId !== user.id) {
        return res.status(403).json({ message: "Unauthorized access to analysis" });
      }
      
      // Generate PDF
      const pdfBuffer = await generatePDF({
        fileName: analysis.fileName,
        uploadDate: analysis.uploadDate,
        totalMessages: analysis.totalMessages,
        participants: analysis.participants,
        sentiment: analysis.sentiment,
        topics: analysis.topics,
        commonWords: analysis.commonWords,
      });
      
      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=chat-analysis-${analysisId}.pdf`
      );
      
      // Send the PDF
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: error.message || "Error generating PDF" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
