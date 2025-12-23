import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { connectDB } from "./db";
import session from 'express-session';
import memorystore from 'memorystore';
import { fileURLToPath } from 'url';
import cors from 'cors';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

const app = express();

// Trust proxy - CRITICAL for secure cookies behind Render's reverse proxy
// Without this, Express thinks requests are HTTP and rejects secure cookies
app.set('trust proxy', 1);

import cookieParser from 'cookie-parser';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configure Helmet for security headers
import helmet from "helmet";
app.use(helmet());

// Configure Rate Limiting
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes",
});
// Apply rate limiting to all requests
app.use(limiter);

// Configure CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://aprameya-asc.vercel.app",
      "https://aprameya-p40k.onrender.com",
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // Check for Vercel preview deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

// Set up in-memory session store
const MemoryStore = memorystore(session);

// Robust production check for Render
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

app.use(session({
  name: "aprameya.sid", // Explicit cookie name
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: process.env.SESSION_SECRET || 'aprameya-session-secret',
  resave: false,
  saveUninitialized: false,
  proxy: true, // Always trust proxy for Render
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: isProduction, // True in Prod, False in Dev (allows local IP testing on mobile)
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax', // None for Cross-Site (Prod), Lax for Same-Site (Dev)
    domain: undefined,
    path: '/',
  },
}));

// IMPORTANT: Add this logging middleware AFTER session middleware
app.use((req, res, next) => {
  console.log('📍 Request:', {
    method: req.method,
    path: req.path,
    sessionID: req.sessionID,
    userId: req.session?.userId,
    hasCookie: !!req.headers.cookie,
    cookies: req.headers.cookie,
  });
  next();
});

// Logging middleware
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

      console.log(logLine);
    }
  });

  next();
});

// Export app and registerRoutes for Vercel
export { app, registerRoutes };

// Start server
(async () => {
  // Only connect to DB and start listener if running directly (not imported as Vercel function)
  if (process.env.NODE_ENV !== 'production' || process.argv[1] === fileURLToPath(import.meta.url)) {
    await connectDB();
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });

    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      console.log(`serving on port ${port}`);
    });
  }
})();
