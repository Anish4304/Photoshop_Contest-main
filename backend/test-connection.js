require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Connection...\n');

// Check environment variables
console.log('Environment Check:');
console.log('✓ MONGODB_URI:', process.env.MONGODB_URI ? 'Found ✅' : 'Missing ❌');
console.log('✓ Connection type:', process.env.MONGODB_URI?.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB');
console.log('');

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file!');
  console.log('💡 Make sure backend/.env file exists with correct content');
  process.exit(1);
}

console.log('🔄 Attempting connection...');
console.log('⏱️  Timeout: 10 seconds\n');

const startTime = Date.now();

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(() => {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('✅ SUCCESS! MongoDB Connected');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 Host: ${mongoose.connection.host}`);
  console.log(`📦 Database: ${mongoose.connection.name}`);
  console.log(`⏱️  Connection Time: ${elapsed}s`);
  console.log(`🔗 Ready State: ${mongoose.connection.readyState} (1 = connected)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🎉 Database is ready to use!');
  process.exit(0);
})
.catch((err) => {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.error('\n❌ CONNECTION FAILED');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error(`Error: ${err.message}`);
  console.error(`Time: ${elapsed}s`);
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  console.log('\n🔍 Troubleshooting Tips:');
  
  if (err.message.includes('ENOTFOUND') || err.message.includes('ETIMEDOUT')) {
    console.log('⚠️  Network Issue Detected');
    console.log('');
    console.log('Possible causes:');
    console.log('1. No internet connection');
    console.log('2. IP address not whitelisted in MongoDB Atlas');
    console.log('3. Firewall blocking port 27017');
    console.log('4. Corporate network restrictions');
    console.log('');
    console.log('Solutions:');
    console.log('✓ Check internet connection');
    console.log('✓ Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access');
    console.log('✓ Try using mobile hotspot or VPN');
    console.log('✓ Temporarily disable firewall/antivirus');
  } else if (err.message.includes('Authentication failed')) {
    console.log('⚠️  Authentication Issue Detected');
    console.log('');
    console.log('✓ Verify username and password in MONGODB_URI');
    console.log('✓ Check if database user exists in MongoDB Atlas');
    console.log('✓ Try resetting database user password');
  } else {
    console.log('⚠️  Unknown Error');
    console.log('');
    console.log('✓ Check DATABASE_TROUBLESHOOTING.md for more help');
    console.log('✓ Verify MongoDB Atlas cluster is running (not paused)');
  }
  
  console.log('');
  process.exit(1);
});

// Handle process events
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Test interrupted');
  mongoose.connection.close();
  process.exit(0);
});
