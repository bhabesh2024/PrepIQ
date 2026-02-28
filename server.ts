import express from "express";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock API routes for PrepIQ
  app.post("/api/login", (req, res) => {
    const { email } = req.body;
    const role = email === "admin@example.com" ? "admin" : "user";
    res.json({ token: "mock-jwt-token", user: { id: 1, name: email ? email.split('@')[0] : "Test User", role, email } });
  });

  app.post("/api/signup", (req, res) => {
    const { email } = req.body;
    const role = email === "admin@example.com" ? "admin" : "user";
    res.json({ token: "mock-jwt-token", user: { id: 1, name: email ? email.split('@')[0] : "Test User", role, email } });
  });

  app.get("/api/questions", (req, res) => {
    const { subject, topic } = req.query;
    res.json([
      { id: 1, text: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4", explanation: "Basic math." },
      { id: 2, text: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], answer: "Paris", explanation: "Paris is the capital." }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
