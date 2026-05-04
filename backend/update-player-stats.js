const mongoose = require('mongoose');
require('dotenv').config();

const playerSchema = new mongoose.Schema({
  name: String,
  position: String,
  number: Number,
  goals: Number,
  assists: Number,
  appearances: Number,
  averageRating: Number,
});

const Player = mongoose.model('Player', playerSchema);

async function updatePlayerStats() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update players with real stats
    await Player.updateOne(
      { name: "Marcus Webb" },
      { goals: 28, assists: 7, appearances: 47, averageRating: 8.2 }
    );
    
    await Player.updateOne(
      { name: "Omar Salah" },
      { goals: 16, assists: 12, appearances: 39, averageRating: 7.8 }
    );
    
    await Player.updateOne(
      { name: "James Osei" },
      { goals: 3, assists: 2, appearances: 52, averageRating: 7.2 }
    );
    
    await Player.updateOne(
      { name: "Lucas Petrov" },
      { goals: 0, assists: 1, appearances: 45, averageRating: 7.4 }
    );

    console.log('✅ Player stats updated!');
    
    // Show updated stats
    const players = await Player.find();
    console.log("\n📊 Current Player Stats:");
    players.forEach(p => {
      console.log(`   ${p.name}: ${p.goals} goals, ${p.assists} assists, ${p.appearances} apps`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

updatePlayerStats();
