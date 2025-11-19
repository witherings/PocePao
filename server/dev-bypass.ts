import type { Request, Response, NextFunction } from "express";
import { getDb } from "./db";
import { adminUsers } from "@shared/schema";

export async function devBypassAuth(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === "production") {
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
          console.log("🔓 Dev mode: Auto-authenticated as", devUser.username);
          next();
        });
      } else {
        console.log("⚠️ Dev mode: No admin users found in database");
        next();
      }
    } catch (err) {
      console.log("Dev bypass auth error:", err);
      next();
    }
  } else {
    next();
  }
}
