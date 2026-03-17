const express = require("express");
const cors = require("cors");

const quizRoutes = require("./routes/quiz.routes");
const questionRoutes = require("./routes/question.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_ORIGIN,
  "http://localhost:3000",
  "https://fe-game-jm8q.vercel.app",
  "https://fe-game-tv44.vercel.app",
  "https://gamequiz-liard.vercel.app",
  "https://game-pi-hazel.vercel.app",
].filter(Boolean);

const vercelPreviewPattern = /^https:\/\/fe-game-[a-z0-9-]+\.vercel\.app$/;

function corsOrigin(origin, callback) {
  if (!origin) return callback(null, true);
  if (allowedOrigins.includes(origin) || vercelPreviewPattern.test(origin)) {
    return callback(null, true);
  }
  callback(new Error("Not allowed by CORS"));
}

const corsOptions = {
  origin: corsOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

app.use("/api", quizRoutes);
app.use("/api", questionRoutes);
app.use("/api", userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
