import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { analyzeChat } from "./services/analysis";

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
  // Upload WhatsApp chat file and analyze
  app.post(
    "/api/upload",
    upload.single("file"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        
        const file = req.file;
        const chatText = file.buffer.toString("utf-8");
        
        // Analyze chat
        const analysis = await analyzeChat(chatText);
        
        // Return the analysis results
        res.json({
          fileName: file.originalname,
          fileSize: file.size,
          uploadDate: new Date(),
          ...analysis
        });
      } catch (error: any) {
        console.error("Error analyzing chat:", error);
        res.status(500).json({ 
          message: error.message || "Error analyzing chat",
          error: error.toString()
        });
      }
    }
  );

  const httpServer = createServer(app);
  return httpServer;
}
