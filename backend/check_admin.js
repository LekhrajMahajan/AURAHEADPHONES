import './dns-fix.js';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Admin from './src/modules/admin/admin.model.js';

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    const adminCount = await Admin.countDocuments();
    console.log('Total Admins in DB:', adminCount);

    const admins = await Admin.find({});
    console.log('Admins:', admins);

    if (admins.length > 0) {
      // Test password matching
      const isMatch = await admins[0].matchPassword('Admin@1234');
      console.log('Does Admin@1234 match the password of the first admin?', isMatch);
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkAdmin();
