const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/photoshop_contest';

const emptyDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      const result = await db.collection(collection.name).deleteMany({});
      console.log(`🗑️  Deleted ${result.deletedCount} documents from ${collection.name}`);
    }
    
    console.log('\n✅ Database emptied successfully!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

emptyDatabase();
