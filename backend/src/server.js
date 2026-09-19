import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_KEY = process.env.ADMIN_KEY || "dev-admin-key";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.use(cors());
app.use(express.json({ limit: "100kb" }));

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

async function writeJson(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

function requireAdmin(req, res, next) {
  if (req.headers["x-admin-key"] !== ADMIN_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "mariam-portfolio-api" });
});

app.get("/api/projects", async (_req, res) => {
  try {
    const projects = await readJson(PROJECTS_FILE);
    res.json(projects);
  } catch {
    res.status(500).json({ message: "Could not load projects." });
  }
});

app.post("/api/projects", requireAdmin, async (req, res) => {
  const { title, category, description, tech = [], github = "#", demo = "#", featured = false } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required." });
  }

  const projects = await readJson(PROJECTS_FILE);
  const project = {
    id: crypto.randomUUID(),
    title,
    category,
    description,
    tech,
    featured,
    github,
    demo
  };

  projects.push(project);
  await writeJson(PROJECTS_FILE, projects);
  res.status(201).json(project);
});

app.put("/api/projects/:id", requireAdmin, async (req, res) => {
  const projects = await readJson(PROJECTS_FILE);
  const index = projects.findIndex((project) => project.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Project not found." });
  }

  projects[index] = { ...projects[index], ...req.body, id: projects[index].id };
  await writeJson(PROJECTS_FILE, projects);
  res.json(projects[index]);
});

app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
  const projects = await readJson(PROJECTS_FILE);
  const next = projects.filter((project) => project.id !== req.params.id);

  if (next.length === projects.length) {
    return res.status(404).json({ message: "Project not found." });
  }

  await writeJson(PROJECTS_FILE, next);
  res.json({ message: "Project deleted." });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ message: "Name, email and message are required." });
  }

  const messages = await readJson(MESSAGES_FILE);

  messages.push({
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString()
  });

  await writeJson(MESSAGES_FILE, messages);

  await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_TO,
  subject: "New message from your portfolio",
  text:
    "Name: " +
    name.trim() +
    "\nEmail: " +
    email.trim() +
    "\n\nMessage:\n" +
    message.trim(),
});

  res.status(201).json({ message: "Message sent successfully." });
});

app.listen(PORT, () => {
  console.log(`Portfolio API running on http://localhost:${PORT}`);
});
