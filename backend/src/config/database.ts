import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

export const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📍 Environment Variables:', {
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI_EXISTS: !!process.env.MONGODB_URI,
    });
    
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log(`📍 Connection URI: ${mongoURI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB'}`);
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // Wait 10 seconds before timeout
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
    return conn;
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error:`);
    console.error(`   Message: ${error.message}`);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
      console.error('   ⚠️  Network issue: Cannot reach MongoDB server');
      console.error('   💡 Possible fixes:');
      console.error('      1. Check your internet connection');
      console.error('      2. Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for all IPs)');
      console.error('      3. Check if your network blocks MongoDB port (27017)');
      console.error('      4. Try using a VPN if behind corporate firewall');
    } else if (error.message.includes('Authentication failed')) {
      console.error('   ⚠️  Authentication issue: Invalid credentials');
      console.error('   💡 Verify MONGODB_URI in .env file has correct username/password');
    } else if (error.message.includes('MongoServerError')) {
      console.error('   ⚠️  MongoDB server error');
      console.error(`   Stack: ${error.stack}`);
    }
    
    throw error; // Re-throw to be caught by caller
  }
};
