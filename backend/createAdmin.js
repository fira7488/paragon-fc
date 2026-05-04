const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'coach', 'staff'], default: 'staff' },
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      name: 'Administrator',
      email: 'admin@paragonfc.com'
    });
    
    await admin.save();
    console.log('✅ Admin user created!');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
    mongoose.disconnect();
  }
}

createAdmin();
