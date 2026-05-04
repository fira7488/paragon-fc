const mongoose = require("mongoose");

const standingSchema = new mongoose.Schema(
  {
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
    season: { type: String, default: "2024-2025" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Standing", standingSchema);
