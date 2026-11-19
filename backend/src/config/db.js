import mongoose from 'mongoose';

export const dbStatus = {
  isConnected: false,
  mode: 'disconnected', // 'mongodb' | 'file-fallback'
  uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_chat_assistant',
  error: null,
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_chat_assistant';
  dbStatus.uri = uri;

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000, // Quick timeout if local mongo isn't up
    });

    dbStatus.isConnected = true;
    dbStatus.mode = 'mongodb';
    dbStatus.error = null;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (err) {
    dbStatus.isConnected = false;
    dbStatus.mode = 'file-fallback';
    dbStatus.error = err.message;

    console.warn(`[MongoDB] Could not connect to MongoDB at ${uri} (${err.message})`);
    console.info(`[MongoDB] Activating persistent local document store fallback (.data/conversations.json) so the application remains fully functional.`);
    return false;
  }
};
