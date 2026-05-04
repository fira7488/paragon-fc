const mongoose = require('mongoose');
require('dotenv').config();

const playerSchema = new mongoose.Schema({
  name: String,
  position: String,
  number: Number,
  height: String,
  weight: String,
  goals: Number,
  assists: Number,
  appearances: Number,
  averageRating: Number,
  imageUrl: String,
  isActive: Boolean,
});

const Player = mongoose.model('Player', playerSchema);

async function updateFullSquad() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing players
    await Player.deleteMany({});
    console.log('✅ Cleared old players');

    // Full Squad - 22 Players
    const players = [
      // Squad A - Starting XI
      { name: "Selemon", position: "GK", number: 1, goals: 0, assists: 0, appearances: 0, averageRating: 7.0, isActive: true },
      { name: "Asebe", position: "DEF", number: 21, goals: 0, assists: 0, appearances: 0, averageRating: 7.0, isActive: true },
      { name: "Samuel", position: "DEF", number: 6, goals: 0, assists: 0, appearances: 0, averageRating: 7.0, isActive: true },
      { name: "Natan", position: "DEF", number: 5, goals: 0, assists: 0, appearances: 0, averageRating: 7.0, isActive: true },
      { name: "Habte", position: "DEF", number: 12, goals: 0, assists: 0, appearances: 0, averageRating: 7.5, isActive: true, captain: true },
      { name: "Nati Abu", position: "MID", number: 88, goals: 0, assists: 0, appearances: 0, averageRating: 7.2, isActive: true },
      { name: "Chucha", position: "MID", number: 47, goals: 0, assists: 0, appearances: 0, averageRating: 7.1, isActive: true },
      { name: "Kalus", position: "MID", number: 10, goals: 0, assists: 0, appearances: 0, averageRating: 7.8, isActive: true },
      { name: "Yared", position: "FWD", number: 30, goals: 0, assists: 0, appearances: 0, averageRating: 7.3, isActive: true },
      { name: "Dave", position: "FWD", number: 17, goals: 0, assists: 0, appearances: 0, averageRating: 7.4, isActive: true },
      { name: "Misge", position: "FWD", number: 7, goals: 0, assists: 0, appearances: 0, averageRating: 7.6, isActive: true },
      
      // Squad B - Second XI
      { name: "Ibrahim", position: "GK", number: 13, goals: 0, assists: 0, appearances: 0, averageRating: 6.9, isActive: true },
      { name: "Sami", position: "DEF", number: 66, goals: 0, assists: 0, appearances: 0, averageRating: 6.8, isActive: true },
      { name: "Girum", position: "DEF", number: 23, goals: 0, assists: 0, appearances: 0, averageRating: 6.9, isActive: true },
      { name: "Haile", position: "DEF", number: 2, goals: 0, assists: 0, appearances: 0, averageRating: 6.8, isActive: true },
      { name: "Ayub", position: "DEF", number: 4, goals: 0, assists: 0, appearances: 0, averageRating: 6.9, isActive: true },
      { name: "George", position: "MID", number: 16, goals: 0, assists: 0, appearances: 0, averageRating: 7.0, isActive: true },
      { name: "Faruk", position: "MID", number: 8, goals: 0, assists: 0, appearances: 0, averageRating: 7.2, isActive: true },
      { name: "Mule", position: "MID", number: 14, goals: 0, assists: 0, appearances: 0, averageRating: 7.0, isActive: true },
      { name: "Rash", position: "FWD", number: 20, goals: 0, assists: 0, appearances: 0, averageRating: 7.1, isActive: true },
      { name: "Salah", position: "FWD", number: 9, goals: 0, assists: 0, appearances: 0, averageRating: 7.5, isActive: true, captain: true },
      { name: "Muhaba", position: "FWD", number: 99, goals: 0, assists: 0, appearances: 0, averageRating: 7.3, isActive: true },
    ];

    await Player.insertMany(players);
    console.log(`✅ Added ${players.length} players to database`);

    // Show all players
    console.log("\n📋 PARAGON FC FULL SQUAD:");
    console.log("═══════════════════════════════════════");
    
    const gks = players.filter(p => p.position === "GK");
    const defs = players.filter(p => p.position === "DEF");
    const mids = players.filter(p => p.position === "MID");
    const fwds = players.filter(p => p.position === "FWD");
    
    console.log(`\n🥅 GOALKEEPERS (${gks.length}):`);
    gks.forEach(p => console.log(`   #${p.number}  ${p.name}`));
    
    console.log(`\n🛡️ DEFENDERS (${defs.length}):`);
    defs.forEach(p => console.log(`   #${p.number}  ${p.name} ${p.captain ? '(C)' : ''}`));
    
    console.log(`\n⚡ MIDFIELDERS (${mids.length}):`);
    mids.forEach(p => console.log(`   #${p.number}  ${p.name}`));
    
    console.log(`\n🎯 FORWARDS (${fwds.length}):`);
    fwds.forEach(p => console.log(`   #${p.number}  ${p.name} ${p.captain ? '(C)' : ''}`));

    console.log("\n✅ Squad update complete!");
    console.log("\n💡 Next steps:");
    console.log("   1. Refresh your admin dashboard");
    console.log("   2. Add player photos to uploads/players/");
    console.log("   3. Update match statistics");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

updateFullSquad();
