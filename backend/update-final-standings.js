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
  goalDifference: Number,
  points: Number,
  form: [String],
  tournament: String,
});

const Standing = mongoose.model('Standing', standingSchema);

async function updateFinalStandings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing standings
    await Standing.deleteMany({});
    console.log('✅ Cleared old standings');

    // ASTU BATCH CUP - FINAL STANDINGS (Paragon Champions!)
    const standings = [
      {
        teamName: "Paragon",
        played: 6,
        wins: 5,
        draws: 1,
        losses: 0,
        goalsFor: 14,
        goalsAgainst: 7,
        goalDifference: 7,
        points: 16,
        form: ["W", "W", "W", "W", "D", "W"],
        tournament: "ASTU Batch Cup 2025 - CHAMPIONS"
      },
      {
        teamName: "Falcons",
        played: 6,
        wins: 4,
        draws: 1,
        losses: 1,
        goalsFor: 13,
        goalsAgainst: 6,
        goalDifference: 7,
        points: 13,
        form: ["W", "W", "W", "D", "L", "W"],
        tournament: "ASTU Batch Cup 2025"
      },
      {
        teamName: "Vanguard",
        played: 6,
        wins: 4,
        draws: 0,
        losses: 2,
        goalsFor: 11,
        goalsAgainst: 7,
        goalDifference: 4,
        points: 12,
        form: ["W", "W", "L", "W", "L", "W"],
        tournament: "ASTU Batch Cup 2025"
      },
      {
        teamName: "Zenora",
        played: 6,
        wins: 2,
        draws: 1,
        losses: 3,
        goalsFor: 8,
        goalsAgainst: 11,
        goalDifference: -3,
        points: 7,
        form: ["L", "W", "D", "L", "W", "L"],
        tournament: "ASTU Batch Cup 2025"
      },
      {
        teamName: "Pioneer",
        played: 6,
        wins: 1,
        draws: 1,
        losses: 4,
        goalsFor: 6,
        goalsAgainst: 13,
        goalDifference: -7,
        points: 4,
        form: ["L", "L", "W", "L", "D", "L"],
        tournament: "ASTU Batch Cup 2025"
      },
      {
        teamName: "Scholar",
        played: 6,
        wins: 0,
        draws: 0,
        losses: 6,
        goalsFor: 3,
        goalsAgainst: 16,
        goalDifference: -13,
        points: 0,
        form: ["L", "L", "L", "L", "L", "L"],
        tournament: "ASTU Batch Cup 2025"
      }
    ];

    await Standing.insertMany(standings);
    console.log(`✅ Updated final tournament standings`);
    
    console.log("\n🏆🏆🏆 ASTU BATCH CUP 2025 - FINAL STANDINGS 🏆🏆🏆");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("  #  TEAM         P   W   D   L   GF   GA   GD   PTS");
    console.log("═══════════════════════════════════════════════════════════");
    
    standings.forEach((team, i) => {
      const rank = i + 1;
      let medal = "";
      if (team.teamName === "Paragon") medal = "🏆 ";
      else if (rank === 2) medal = "🥈 ";
      else if (rank === 3) medal = "🥉 ";
      else medal = "   ";
      
      console.log(`${medal}${rank}. ${team.teamName.padEnd(10)} ${team.played}   ${team.wins}   ${team.draws}   ${team.losses}   ${team.goalsFor}    ${team.goalsAgainst}    ${team.goalDifference}    ${team.points}`);
    });
    
    console.log("═══════════════════════════════════════════════════════════");
    console.log("\n🏆 PARAGON FC ARE THE ASTU BATCH CUP CHAMPIONS! 🏆");
    console.log("📅 Final Match: Paragon vs Zenora");
    console.log("📊 Result: Paragon Won!");
    console.log("\n🎉 CELEBRATION TIME! 🎉");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

updateFinalStandings();
