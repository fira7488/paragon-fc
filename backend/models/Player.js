const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: {
      type: String,
      enum: ["GK", "DEF", "MID", "FWD"],
      required: true,
    },
    number: { type: Number, required: true, unique: true },
    height: String,
    weight: String,
    pace: Number,
    shooting: Number,
    defense: Number,
    stamina: Number,
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    appearances: { type: Number, default: 0 },
    averageRating: { type: Number, default: 6.5 },
    imageUrl: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Player", playerSchema);
