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

async function updateTournamentStandings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing standings
    await Standing.deleteMany({});
    console.log('✅ Cleared old standings');

    // ASTU BATCH CUP - Tournament Standings
    const standings = [
      {
        teamName: "Falcons",
        played: 5,
        wins: 4,
        draws: 1,
        losses: 0,
        goalsFor: 12,
        goalsAgainst: 4,
        goalDifference: 8,
        points: 13,
        form: ["W", "W", "W", "D", "W"],
        tournament: "ASTU Batch Cup 2025"
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
        tournament: "ASTU Batch Cup 2025"
      },
      {
        teamName: "Paragon",
        played: 5,
        wins: 3,
        draws: 1,
        losses: 1,
        goalsFor: 9,
        goalsAgainst: 6,
        goalDifference: 3,
        points: 10,
        form: ["W", "L", "W", "D", "W"],
        tournament: "ASTU Batch Cup 2025"
      },
      {
        teamName: "Zenora",
        played: 5,
        wins: 2,
        draws: 1,
        losses: 2,
        goalsFor: 7,
        goalsAgainst: 8,
        goalDifference: -1,
        points: 7,
        form: ["L", "W", "D", "L", "W"],
        tournament: "ASTU Batch Cup 2025"
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
        tournament: "ASTU Batch Cup 2025"
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
        tournament: "ASTU Batch Cup 2025"
      }
    ];

    await Standing.insertMany(standings);
    console.log(`✅ Added ${standings.length} teams to tournament standings`);
    
    console.log("\n🏆 ASTU BATCH CUP 2025 - STANDINGS");
    console.log("═══════════════════════════════════════════════════");
    console.log("  #  TEAM         P   W   D   L   GF   GA   GD   PTS");
    console.log("═══════════════════════════════════════════════════");
    
    standings.forEach((team, i) => {
      const rank = i + 1;
      const highlight = team.teamName === "Paragon" ? "👉 " : "   ";
      console.log(`${highlight}${rank}. ${team.teamName.padEnd(10)} ${team.played}   ${team.wins}   ${team.draws}   ${team.losses}   ${team.goalsFor}    ${team.goalsAgainst}    ${team.goalDifference}    ${team.points}`);
    });
    
    console.log("═══════════════════════════════════════════════════");
    console.log("\n✅ Paragon FC is currently in 3rd place!");
    console.log("   Next match: Paragon vs Zenora");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

updateTournamentStandings();
