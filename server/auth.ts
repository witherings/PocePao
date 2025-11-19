import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { getDb } from "./db";
import { adminUsers } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { AdminUser } from "@shared/schema";

// Configure passport local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const db = await getDb();
      const users = await db.select().from(adminUsers).where(eq(adminUsers.username, username));

      if (users.length === 0) {
        return done(null, false, { message: "Incorrect username" });
      }

      const user = users[0];
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize user to session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const db = await getDb();
    const users = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    if (users.length === 0) {
      return done(null, false);
    }
    done(null, users[0]);
  } catch (error) {
    done(error);
  }
});

// Middleware to check if user is authenticated
export function ensureAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

export { passport };
