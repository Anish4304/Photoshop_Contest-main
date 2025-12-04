const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = 'mongodb://localhost:27017/photoshop_contest';

const deleteAllPhotos = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    
    // Delete all photos from database
    const result = await db.collection('photos').deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} photos from database`);
    
    // Delete related data
    const scoresResult = await db.collection('judgescores').deleteMany({});
    console.log(`🗑️  Deleted ${scoresResult.deletedCount} judge scores`);
    
    const votesResult = await db.collection('visitorvotes').deleteMany({});
    console.log(`🗑️  Deleted ${votesResult.deletedCount} visitor votes`);
    
    const winnersResult = await db.collection('winners').deleteMany({});
    console.log(`🗑️  Deleted ${winnersResult.deletedCount} winners`);
    
    const galleriesResult = await db.collection('galleries').deleteMany({});
    console.log(`🗑️  Deleted ${galleriesResult.deletedCount} galleries`);
    
    // Delete image files
    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(uploadsDir, file));
        console.log(`🗑️  Deleted image: ${file}`);
      });
    }
    
    console.log('\n✅ All photos and related data deleted successfully!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

deleteAllPhotos();
