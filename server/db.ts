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

    // Clean up legacy unique userId_1 index on recruitmentapplications if it exists
    try {
      const collections = await mongoose.connection.db?.listCollections({ name: 'recruitmentapplications' }).toArray();
      if (collections && collections.length > 0) {
        const recruitmentColl = mongoose.connection.collection('recruitmentapplications');
        const indexes = await recruitmentColl.indexes();
        const legacyIndex = indexes.find((idx: any) => idx.name === 'userId_1' && idx.unique);
        if (legacyIndex) {
          await recruitmentColl.dropIndex('userId_1');
          console.log('Dropped legacy unique index userId_1 from recruitmentapplications');
        }
      }
    } catch (idxErr) {
      console.warn('Index check on recruitmentapplications:', idxErr);
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

