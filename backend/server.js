const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Node scripts, Postman)
    if (!origin) return callback(null, true);

    // In development, allow any origin (including file://, localhost variations)
    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }

    // Production: restrict to specific domains
    const allowedOrigins = [
      "https://yourdomain.com",
      "https://paragon-fc.vercel.app",
    ];
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    callback(new Error("CORS not allowed for this origin"), false);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Create uploads directories
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}
if (!fs.existsSync("./uploads/gallery")) {
  fs.mkdirSync("./uploads/gallery", { recursive: true });
}
if (!fs.existsSync("./uploads/players")) {
  fs.mkdirSync("./uploads/players", { recursive: true });
}
if (!fs.existsSync("./uploads/matches")) {
  fs.mkdirSync("./uploads/matches", { recursive: true });
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err.message));

// ============= FILE UPLOAD CONFIGURATION =============
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.query.type || "gallery";
    if (type === "gallery") cb(null, "uploads/gallery/");
    else if (type === "player") cb(null, "uploads/players/");
    else if (type === "match") cb(null, "uploads/matches/");
    else cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// ============= AUTH MIDDLEWARE =============
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "paragonfc_secret",
    (err, user) => {
      if (err)
        return res.status(403).json({ error: "Invalid or expired token" });
      req.user = user;
      next();
    },
  );
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

// ============= MODELS =============

// Player Model
const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, enum: ["GK", "DEF", "MID", "FWD"], required: true },
  number: { type: Number, required: true, unique: true },
  height: String,
  weight: String,
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  appearances: { type: Number, default: 0 },
  averageRating: { type: Number, default: 6.5 },
  imageUrl: String,
  isActive: { type: Boolean, default: true },
});

const Player = mongoose.model("Player", playerSchema);

// Standing Model
const standingSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  played: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  goalDifference: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  form: [{ type: String, enum: ["W", "D", "L"] }],
  tournament: { type: String, default: "ASTU Batch Cup 2025" },
  position: Number,
  achievement: String,
});

const Standing = mongoose.model("Standing", standingSchema);

// Gallery Schema
const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: { type: String, required: true },
  thumbnailUrl: String,
  uploadedBy: { type: String, default: "Fan" },
  uploadedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: {
    type: String,
    enum: [
      "Match",
      "Training",
      "Celebration",
      "Team Photo",
      "Award",
      "Fan",
      "Behind the Scenes",
    ],
    default: "Match",
  },
  tags: [String],
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: String,
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: String,
      date: { type: Date, default: Date.now },
    },
  ],
  isApproved: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

const Gallery = mongoose.model("Gallery", gallerySchema);

// User Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "super_admin", "staff"],
    default: "staff",
  },
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// Match Model
const matchSchema = new mongoose.Schema({
  opponent: { type: String, required: true },
  date: { type: Date, required: true },
  venue: String,
  competition: String,
  result: {
    type: String,
    enum: ["W", "D", "L", "UPCOMING"],
    default: "UPCOMING",
  },
  score: { home: Number, away: Number },
  goalscorers: [
    {
      player: String,
      minute: Number,
      assist: String,
    },
  ],
  matchReport: String,
});

const Match = mongoose.model("Match", matchSchema);

// ============= API ROUTES =============

// Players
app.get("/api/players", async (req, res) => {
  try {
    const players = await Player.find().sort("number");
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post(
  "/api/players",
  authenticateToken,
  authorize("admin", "super_admin"),
  upload.single("image"),
  async (req, res) => {
    try {
      let playerData = req.body;
      if (typeof playerData === "string") playerData = JSON.parse(playerData);
      if (req.file)
        playerData.imageUrl = `/uploads/players/${req.file.filename}`;
      const player = new Player(playerData);
      await player.save();
      res.status(201).json(player);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

app.put(
  "/api/players/:id",
  authenticateToken,
  authorize("admin", "super_admin"),
  async (req, res) => {
    try {
      const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(player);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

app.delete(
  "/api/players/:id",
  authenticateToken,
  authorize("super_admin"),
  async (req, res) => {
    try {
      await Player.findByIdAndDelete(req.params.id);
      res.json({ message: "Player deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Standings
app.get("/api/standings", async (req, res) => {
  try {
    const standings = await Standing.find().sort({
      points: -1,
      goalDifference: -1,
    });
    res.json(standings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stats
app.get("/api/stats", async (req, res) => {
  try {
    const totalPlayers = await Player.countDocuments();
    const topScorer = await Player.findOne().sort("-goals");
    const totalGoals = await Player.aggregate([
      { $group: { _id: null, total: { $sum: "$goals" } } },
    ]);
    res.json({
      players: { total: totalPlayers, topScorer },
      goals: { total: totalGoals[0]?.total || 0 },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === "superadmin" && password === "SuperAdmin2025!") {
      const token = jwt.sign(
        { username: "superadmin", role: "super_admin" },
        process.env.JWT_SECRET || "paragonfc_secret",
        { expiresIn: "24h" },
      );
      return res.json({
        token,
        user: {
          username: "superadmin",
          role: "super_admin",
          name: "Super Admin",
        },
      });
    }

    res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= GALLERY ROUTES =============

// Get all gallery images (public)
app.get("/api/gallery", async (req, res) => {
  try {
    const { category, limit, page = 1 } = req.query;
    let query = { isApproved: true };
    if (category && category !== "all") query.category = category;

    const limitNum = parseInt(limit) || 20;
    const skip = (parseInt(page) - 1) * limitNum;

    const images = await Gallery.find(query)
      .sort("-date")
      .skip(skip)
      .limit(limitNum);
    const total = await Gallery.countDocuments(query);

    res.json({
      data: images,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single gallery image
app.get("/api/gallery/:id", async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });
    image.views += 1;
    await image.save();
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload gallery image (public)
app.post("/api/gallery/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const galleryData = JSON.parse(req.body.data);
    const gallery = new Gallery({
      ...galleryData,
      imageUrl: `/uploads/gallery/${req.file.filename}`,
      uploadedBy: galleryData.uploadedBy || "Anonymous Fan",
      date: new Date(),
    });

    await gallery.save();
    res
      .status(201)
      .json({ message: "Memory uploaded successfully!", image: gallery });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Like an image
app.post("/api/gallery/:id/like", async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });
    image.likes += 1;
    await image.save();
    res.json({ likes: image.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment
app.post("/api/gallery/:id/comment", async (req, res) => {
  try {
    const { user, comment } = req.body;
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    image.comments.push({ user, comment, date: new Date() });
    await image.save();
    res.json({ comments: image.comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all gallery images
app.get(
  "/api/admin/gallery",
  authenticateToken,
  authorize("admin", "super_admin"),
  async (req, res) => {
    try {
      const images = await Gallery.find().sort("-date");
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Admin: Delete gallery image
app.delete(
  "/api/gallery/:id",
  authenticateToken,
  authorize("admin", "super_admin"),
  async (req, res) => {
    try {
      const image = await Gallery.findByIdAndDelete(req.params.id);
      if (image && image.imageUrl) {
        const filePath = path.join(__dirname, image.imageUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Root / Health Check Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Paragon FC API is running",
    meta: {
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(), // seconds
    },
    endpoints: {
      players: "/api/players",
      standings: "/api/standings",
      gallery: "/api/gallery",
      stats: "/api/stats",
      login: "/api/auth/login",
    },
  });
});

// ============= SEED DATA =============
async function seedData() {
  const playerCount = await Player.countDocuments();
  if (playerCount === 0) {
    await Player.insertMany([
      {
        name: "Selemon",
        position: "GK",
        number: 1,
        height: "1.85m",
        weight: "78kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Asebe",
        position: "DEF",
        number: 21,
        height: "1.78m",
        weight: "72kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Samuel",
        position: "DEF",
        number: 6,
        height: "1.82m",
        weight: "75kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Natan",
        position: "DEF",
        number: 5,
        height: "1.80m",
        weight: "74kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Habte",
        position: "DEF",
        number: 12,
        height: "1.76m",
        weight: "70kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Nati Abu",
        position: "MID",
        number: 88,
        height: "1.75m",
        weight: "68kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Chucha",
        position: "MID",
        number: 47,
        height: "1.77m",
        weight: "71kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Kalus",
        position: "MID",
        number: 10,
        height: "1.74m",
        weight: "67kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Yared",
        position: "FWD",
        number: 30,
        height: "1.79m",
        weight: "73kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Dave",
        position: "FWD",
        number: 17,
        height: "1.81m",
        weight: "76kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Misge",
        position: "FWD",
        number: 7,
        height: "1.78m",
        weight: "72kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Ibrahim",
        position: "GK",
        number: 13,
        height: "1.83m",
        weight: "77kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Sami",
        position: "DEF",
        number: 66,
        height: "1.80m",
        weight: "74kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Girum",
        position: "DEF",
        number: 23,
        height: "1.77m",
        weight: "71kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Haile",
        position: "DEF",
        number: 2,
        height: "1.79m",
        weight: "73kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Ayub",
        position: "DEF",
        number: 4,
        height: "1.76m",
        weight: "70kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "George",
        position: "MID",
        number: 16,
        height: "1.75m",
        weight: "69kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Faruk",
        position: "MID",
        number: 8,
        height: "1.74m",
        weight: "68kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Mule",
        position: "MID",
        number: 14,
        height: "1.76m",
        weight: "70kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Rash",
        position: "FWD",
        number: 20,
        height: "1.78m",
        weight: "72kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Salah",
        position: "FWD",
        number: 9,
        height: "1.80m",
        weight: "75kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
      {
        name: "Muhaba",
        position: "FWD",
        number: 99,
        height: "1.82m",
        weight: "77kg",
        goals: 0,
        assists: 0,
        appearances: 0,
      },
    ]);
    console.log("✅ 22 Players seeded");
  }

  const standingCount = await Standing.countDocuments();
  if (standingCount === 0) {
    await Standing.insertMany([
      {
        teamName: "Paragon",
        played: 6,
        wins: 4,
        draws: 1,
        losses: 1,
        goalsFor: 12,
        goalsAgainst: 8,
        goalDifference: 4,
        points: 13,
        form: ["W", "L", "W", "D", "W", "W"],
        position: 1,
        achievement: "CHAMPIONS 🏆",
      },
      {
        teamName: "Falcons",
        played: 6,
        wins: 4,
        draws: 1,
        losses: 1,
        goalsFor: 14,
        goalsAgainst: 6,
        goalDifference: 8,
        points: 13,
        form: ["W", "W", "W", "D", "W", "L"],
        position: 2,
        achievement: "Runners-up",
      },
      {
        teamName: "Vanguard",
        played: 5,
        wins: 4,
        draws: 0,
        losses: 1,
        goalsFor: 10,
        goalsAgainst: 5,
        goalDifference: 5,
        points: 12,
        form: ["W", "W", "L", "W", "W"],
        position: 3,
        achievement: "Semi-finalists",
      },
      {
        teamName: "Zenora",
        played: 6,
        wins: 3,
        draws: 1,
        losses: 2,
        goalsFor: 9,
        goalsAgainst: 10,
        goalDifference: -1,
        points: 10,
        form: ["L", "W", "D", "L", "W", "L"],
        position: 4,
        achievement: "Finalists",
      },
      {
        teamName: "Pioneer",
        played: 5,
        wins: 1,
        draws: 1,
        losses: 3,
        goalsFor: 5,
        goalsAgainst: 10,
        goalDifference: -5,
        points: 4,
        form: ["L", "L", "W", "L", "D"],
        position: 5,
        achievement: "Group Stage",
      },
      {
        teamName: "Scholar",
        played: 5,
        wins: 0,
        draws: 0,
        losses: 5,
        goalsFor: 2,
        goalsAgainst: 12,
        goalDifference: -10,
        points: 0,
        form: ["L", "L", "L", "L", "L"],
        position: 6,
        achievement: "Group Stage",
      },
    ]);
    console.log("✅ Tournament standings seeded");
  }
}
// ============= START SERVER =============
const PORT = process.env.PORT || 5000;

// Wait for MongoDB connection to be fully established before starting the server and seeding
mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connection ready");
  // ============ NEWS ROUTES ============
  app.get("/api/news", async (req, res) => {
    try {
      const { limit = 3 } = req.query;
      // For now, return empty array or some sample data
      const news = []; // replace with real data later
      res.json(news);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    res.status(404).json({ error: "Not implemented yet" });
  });

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("╔══════════════════════════════════════════════════╗");
    console.log("║     🏆 PARAGON FC - CHAMPIONS EDITION 🏆         ║");
    console.log("╠══════════════════════════════════════════════════╣");
    console.log(`║   📡 API:      http://localhost:${PORT}              ║`);
    console.log(`║   🖼️ Gallery:  http://localhost:${PORT}/api/gallery  ║`);
    console.log("╠══════════════════════════════════════════════════╣");
    console.log("║   🔐 Login:    superadmin / SuperAdmin2025!      ║");
    console.log("╠══════════════════════════════════════════════════╣");
    console.log("║   ✨ Features:                                   ║");
    console.log("║      • 22 Players                                ║");
    console.log("║      • Memory Gallery                            ║");
    console.log("║      • Tournament Standings                      ║");
    console.log("║      • Champions: ASTU Batch Cup 2025 🏆         ║");
    console.log("╚══════════════════════════════════════════════════╝");
    console.log("");
  });

  seedData().catch((err) => console.error("❌ Seeding error:", err));
});

// Handle connection errors
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});
