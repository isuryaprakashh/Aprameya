import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  // Default to a local MongoDB instance if not provided, or warn
  console.warn("MONGODB_URI must be set. Defaulting to local instance.");
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/aprameya';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

