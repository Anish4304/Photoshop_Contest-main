const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('URI:', process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    
    console.log('✅ Connected successfully!');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    
    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.reason) {
      console.error('Reason:', error.reason);
    }
    process.exit(1);
  }
};

testConnection();
