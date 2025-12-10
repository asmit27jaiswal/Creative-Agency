const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");

dotenv.config();

const Project = require("./models/Project");
const Client = require("./models/Client");
const Contact = require("./models/Contact");
const Subscriber = require("./models/Subscriber");

const app = express();

// ---------- Middleware ----------
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000"
  })
);

// ---------- Upload directory & static serving ----------
const uploadDir = process.env.UPLOAD_DIR || "uploads";

// ensure uploads folder exists (backend/uploads)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// serve uploaded images at /uploads/...
app.use("/uploads", express.static(path.join(__dirname, uploadDir)));

// ---------- MongoDB connection ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

// ---------- Multer & sharp for image upload/crop ----------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// helper: crop image and return relative URL (/uploads/filename.jpg)
async function saveCropped(buffer, prefix) {
  const filename = `${prefix}-${Date.now()}.jpg`;
  const outPath = path.join(uploadDir, filename);
  await sharp(buffer).resize(450, 350).toFile(outPath);
  // store only a relative path in Mongo; React will prefix backend URL
  return `/uploads/${filename}`;
}

/* ================= PUBLIC ROUTES (LANDING PAGE) ================= */

// GET all projects
app.get("/api/projects", async (req, res) => {
  const items = await Project.find().sort({ _id: -1 });
  res.json(items);
});

// GET all clients
app.get("/api/clients", async (req, res) => {
  const items = await Client.find().sort({ _id: -1 });
  res.json(items);
});

// POST contact form
app.post("/api/contact", async (req, res) => {
  const { fullName, email, phone, city } = req.body;
  if (!fullName || !email || !phone || !city) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const doc = await Contact.create({ fullName, email, phone, city });
  res.status(201).json(doc);
});

// POST newsletter subscribe
app.post("/api/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const existing = await Subscriber.findOne({ email });
  if (existing) return res.status(200).json({ message: "Already subscribed" });

  const doc = await Subscriber.create({ email });
  res.status(201).json(doc);
});

/* ================= ADMIN ROUTES (NO AUTH FOR ASSIGNMENT) ================= */

// POST add project (image optional, cropped to 450x350)
app.post("/api/admin/projects", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    let imageUrl = "";

    if (req.file) {
      imageUrl = await saveCropped(req.file.buffer, "project");
    }

    const doc = await Project.create({ name, description, imageUrl });
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating project" });
  }
});

// POST add client (image optional, cropped to 450x350)
app.post("/api/admin/clients", upload.single("image"), async (req, res) => {
  try {
    const { name, designation, description } = req.body;
    let imageUrl = "";

    if (req.file) {
      imageUrl = await saveCropped(req.file.buffer, "client");
    }

    const doc = await Client.create({ name, designation, description, imageUrl });
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating client" });
  }
});

// GET contact form entries
app.get("/api/admin/contacts", async (req, res) => {
  const items = await Contact.find().sort({ createdAt: -1 });
  res.json(items);
});

// GET newsletter subscribers
app.get("/api/admin/subscribers", async (req, res) => {
  const items = await Subscriber.find().sort({ createdAt: -1 });
  res.json(items);
});

// ---------- Health check route ----------
app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
