const mongoose = require('mongoose');
require('dotenv').config();

const standingSchema = new mongoose.Schema({
  teamName: String,
  played: Number,
  wins: Number,
  draws: Number,
  losses: Number,
  goalsFor: Number,
  goalsAgainst: Number,
  points: Number,
});

const Standing = mongoose.model('Standing', standingSchema);

async function updateStandings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Standing.deleteMany({});
    
    const standings = [
      { teamName: "Phoenix FC", played: 18, wins: 15, draws: 2, losses: 1, goalsFor: 48, goalsAgainst: 14, points: 47 },
      { teamName: "Paragon FC", played: 19, wins: 14, draws: 3, losses: 2, goalsFor: 47, goalsAgainst: 18, points: 45 },
      { teamName: "Vortex SC", played: 18, wins: 13, draws: 2, losses: 3, goalsFor: 39, goalsAgainst: 20, points: 41 },
      { teamName: "Apex FC", played: 18, wins: 11, draws: 4, losses: 3, goalsFor: 38, goalsAgainst: 25, points: 37 },
      { teamName: "Iron Gate FC", played: 19, wins: 9, draws: 3, losses: 7, goalsFor: 30, goalsAgainst: 28, points: 30 },
      { teamName: "Nexus United", played: 18, wins: 8, draws: 4, losses: 6, goalsFor: 28, goalsAgainst: 31, points: 28 },
    ];

    await Standing.insertMany(standings);
    console.log('✅ Standings updated!');
    
    console.log("\n📊 LEAGUE TABLE:");
    standings.forEach((t, i) => {
      console.log(`   ${i+1}. ${t.teamName} - ${t.points} pts`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

updateStandings();
