import type { Request, Response, NextFunction } from "express";
import { getDb } from "./db";
import { adminUsers } from "@shared/schema";

/**
 * Auto-authentication middleware for Replit development environment only
 * Uses REPLIT_DEV_DOMAIN to detect Replit dev environment (not available on Railway or in Replit deployments)
 */
export async function devBypassAuth(req: Request, res: Response, next: NextFunction) {
  // Only enable auto-auth in Replit development environment
  // REPLIT_DEV_DOMAIN exists only in Replit dev, not in Railway or Replit deployments
  const isReplitDev = !!process.env.REPLIT_DEV_DOMAIN;
  
  if (!isReplitDev) {
    return next();
  }

  if (!req.isAuthenticated() && req.path.startsWith("/api/admin/")) {
    try {
      const db = await getDb();
      const users = await db.select().from(adminUsers).limit(1);
      
      if (users.length > 0) {
        const devUser = users[0];
        req.login(devUser, (err) => {
          if (err) {
            console.log("Dev bypass auth failed:", err);
            return next();
          }
          console.log("🔓 Replit Dev: Auto-authenticated as", devUser.username);
          next();
        });
      } else {
        console.log("⚠️ Replit Dev: No admin users found in database");
        next();
      }
    } catch (err) {
      console.log("Replit dev bypass auth error:", err);
      next();
    }
  } else {
    next();
  }
}
