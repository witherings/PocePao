import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { passport } from "./auth";
import { devBypassAuth } from "./dev-bypass";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { getPool } from "./db";
import { ensureAdminExists } from "./bootstrap";
import path from "path";

const app = express();

// Trust proxy for Railway load balancer (CRITICAL for session/auth)
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware - will be configured after database connection
let sessionMiddleware: any;

// Passport middleware - will be configured after session middleware

// Dev mode: Auto-authenticate admin for easier testing
if (process.env.NODE_ENV !== "production") {
  app.use(devBypassAuth);
}

// Serve menu images from public/images
app.use("/images", express.static("public/images"));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize app
async function initializeApp() {
  // Initialize database connection first
  const pool = await getPool();
  
  // Setup session store with database connection
  const PgStore = connectPgSimple(session);
  const sessionStore = process.env.DATABASE_URL && pool
    ? new PgStore({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true,
      })
    : undefined;

  sessionMiddleware = session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "pokepao-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "strict", // CSRF protection
    },
  });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  await ensureAdminExists();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Serve static files in production (Railway)
    serveStatic(app);
  }

  return server;
}

// Start the server (Railway deployment)
initializeApp().then((server) => {
  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Railway injects this automatically. Default to 5000 for local development.
  const port = parseInt(process.env.PORT || '5000', 10);
  // reusePort is not supported on some platforms (notably default Windows sockets)
  // so only set it when the platform is not win32.
  const listenOptions: any = {
    port,
    host: "0.0.0.0",
  };
  if (process.platform !== 'win32') {
    listenOptions.reusePort = true;
  }

  server.listen(listenOptions, () => {
    log(`serving on port ${port}`);
  });
});

// Export app for other modules
export { app, initializeApp };
