
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

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "mariam-portfolio-api",
  });
});

// Get projects
app.get("/api/projects", async (_req, res) => {
  try {
    const projects = await readJson(PROJECTS_FILE);
    res.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      message: "Could not load projects.",
    });
  }
});

// Add project
app.post("/api/projects", requireAdmin, async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      tech = [],
      github = "#",
      demo = "#",
      featured = false,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required.",
      });
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
      demo,
    };

    projects.push(project);
    await writeJson(PROJECTS_FILE, projects);

    res.status(201).json(project);
  } catch (error) {
    console.error("Add project error:", error);

    res.status(500).json({
      message: "Could not add project.",
    });
  }
});

// Update project
app.put("/api/projects/:id", requireAdmin, async (req, res) => {
  try {
    const projects = await readJson(PROJECTS_FILE);

    const index = projects.findIndex(
      (project) => project.id === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    projects[index] = {
      ...projects[index],
      ...req.body,
      id: projects[index].id,
    };

    await writeJson(PROJECTS_FILE, projects);

    res.json(projects[index]);
  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      message: "Could not update project.",
    });
  }
});

// Delete project
app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
  try {
    const projects = await readJson(PROJECTS_FILE);

    const next = projects.filter(
      (project) => project.id !== req.params.id
    );

    if (next.length === projects.length) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    await writeJson(PROJECTS_FILE, next);

    res.json({
      message: "Project deleted.",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      message: "Could not delete project.",
    });
  }
});

// Contact form
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        message: "Name, email and message are required.",
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      replyTo: email.trim(),
      subject: "New message from your portfolio",
      text:
        "Name: " +
        name.trim() +
        "\nEmail: " +
        email.trim() +
        "\n\nMessage:\n" +
        message.trim(),
    });

    res.status(201).json({
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    res.status(500).json({
      message: "Could not send message. Please try again later.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;