import { Express, Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { storage } from "./storage";

// Auth0 configuration
const auth0Config = {
  domain: process.env.AUTH0_DOMAIN || "dev-iciyt2qbbo0n5lki.us.auth0.com",
  audience: process.env.AUTH0_AUDIENCE || "https://whatsapp-analyzer/api",
  clientId: process.env.AUTH0_CLIENT_ID || "CRRdV4gp222Ek0c4CDzDRYgBxQu4ffYH",
};

// JWT auth middleware
export const checkJwt = auth({
  audience: auth0Config.audience,
  issuerBaseURL: `https://${auth0Config.domain}/`,
});

// Get user profile from Auth0
export async function getUserProfile(token: string) {
  try {
    const response = await fetch(`https://${auth0Config.domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching user profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

// Middleware to ensure user exists in our database
export async function ensureUserInDb(req: Request, res: Response, next: NextFunction) {
  try {
    // Get Auth0 user ID from auth token
    const auth0Id = req.auth?.payload.sub;
    
    if (!auth0Id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Check if user exists in our database
    let user = await storage.getUserByAuth0Id(auth0Id);
    
    if (!user) {
      // If not, get user profile from Auth0 and create in our database
      const token = req.headers.authorization?.split(" ")[1];
      
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const profile = await getUserProfile(token);
      
      user = await storage.createUser({
        auth0Id: profile.sub,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      });
    }
    
    // Add user to request object
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Error in ensureUserInDb middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
