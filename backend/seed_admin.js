import './dns-fix.js';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Admin from './src/modules/admin/admin.model.js';

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    const email = 'admin@aura.com';
    const password = 'Admin@1234'; // Default initial password

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists. Deleting and recreating for reset...');
      await Admin.deleteOne({ email });
    }

    const admin = await Admin.create({
      email,
      password,
      role: 'superadmin'
    });

    console.log('Admin Created Successfully!');
    console.log('Email:', admin.email);
    console.log('Password: (Using the one from your .env or Admin@1234)');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
