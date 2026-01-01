import dotenv from 'dotenv';
dotenv.config();


import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined');
}

export async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected');
}
