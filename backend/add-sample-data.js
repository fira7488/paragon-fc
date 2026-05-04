const mongoose = require('mongoose');
require('dotenv').config();

// Define Match Schema
const matchSchema = new mongoose.Schema({
  opponent: String,
  date: Date,
  venue: String,
  competition: String,
  result: String,
  score: { home: Number, away: Number },
  goalscorers: Array,
  matchReport: String,
});

const Match = mongoose.model('Match', matchSchema);

async function addSampleData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing matches
    await Match.deleteMany({});
    console.log('✅ Cleared old matches');

    // Sample match data
    const matches = [
      {
        opponent: "Phoenix FC",
        date: new Date("2025-04-12T14:00:00"),
        venue: "Away",
        competition: "League",
        result: "W",
        score: { home: 2, away: 1 },
        goalscorers: [
          { player: "Marcus Webb", minute: 34 },
          { player: "Omar Salah", minute: 67 }
        ],
        matchReport: "Great away win against league leaders!"
      },
      {
        opponent: "Vortex SC",
        date: new Date("2025-04-19T14:00:00"),
        venue: "Home",
        competition: "League",
        result: "W",
        score: { home: 4, away: 0 },
        goalscorers: [
          { player: "Marcus Webb", minute: 12 },
          { player: "Marcus Webb", minute: 45 },
          { player: "James Osei", minute: 58 },
          { player: "Omar Salah", minute: 78 }
        ],
        matchReport: "Dominant home performance!"
      },
      {
        opponent: "Iron Gate FC",
        date: new Date("2025-04-26T14:00:00"),
        venue: "Away",
        competition: "League",
        result: "D",
        score: { home: 2, away: 2 },
        goalscorers: [
          { player: "Marcus Webb", minute: 23 },
          { player: "Kai Watanabe", minute: 88 }
        ],
        matchReport: "Late equalizer secures a point!"
      },
      {
        opponent: "Apex FC",
        date: new Date("2025-05-03T14:00:00"),
        venue: "Home",
        competition: "League",
        result: "W",
        score: { home: 3, away: 1 },
        goalscorers: [
          { player: "Marcus Webb", minute: 15 },
          { player: "Theo Adeyemi", minute: 42 },
          { player: "Omar Salah", minute: 71 }
        ],
        matchReport: "Another solid home victory!"
      },
      {
        opponent: "Nexus United",
        date: new Date("2025-05-10T14:00:00"),
        venue: "Away",
        competition: "League",
        result: "L",
        score: { home: 0, away: 1 },
        goalscorers: [],
        matchReport: "Tough loss against strong opposition."
      }
    ];

    await Match.insertMany(matches);
    console.log(`✅ Added ${matches.length} sample matches`);

    console.log("\n📊 Sample matches added:");
    matches.forEach(m => {
      console.log(`   - ${m.opponent}: ${m.score.home}-${m.score.away} (${m.result})`);
    });

    await mongoose.disconnect();
    console.log("\n✅ Done! Refresh your dashboard to see the matches.");
  } catch (error) {
    console.error("❌ Error:", error.message);
    await mongoose.disconnect();
  }
}

addSampleData();
