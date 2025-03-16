import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import path from "path";
import conf from "../conf.js";

const app = express();
app.use(bodyParser.json());

// Apply security headers using Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// CORS configuration

// app.use(cors({ origin: conf.FRONTEND_URL, credentials: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        conf.FRONTEND_URL,
        // conf.CORS_ORIGIN1.replace(/\/$/, ""),
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// Additional security headers
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  next();
});

// Middleware for parsing JSON, cookies, and serving static files
app.use(express.json());
app.set("trust proxy", "loopback"); // Trust only localhost


// app.use(express.static("public"));
app.use(express.static(path.join(process.cwd(), "public")));

app.use(cookieParser());

// Routes
import Routes from "./routes/index.js";
app.use("/api", Routes);

// Test routes
app.post("/testing", (req, res) => {
  console.log("Testing");
  res.send("Hello, testing completed");
});

app.get("/", (req, res) => {
  res.send("Welcome to the Express Server with Security Measures!");
});

export { app };
