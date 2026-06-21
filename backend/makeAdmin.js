require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function makeAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.argv[2];
  if (!email) {
    console.log('Usage: node makeAdmin.js youremail@gmail.com');
    process.exit(1);
  }
  const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
  if (user) {
    console.log(`Success! ${user.email} is now an admin.`);
  } else {
    console.log('User not found');
  }
  process.exit(0);
}

makeAdmin();
