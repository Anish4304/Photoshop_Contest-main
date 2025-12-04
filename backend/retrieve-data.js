const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/photoshop_contest';

const retrieveData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📊 Database: photoshop_contest');
    console.log('📁 Collections found:', collections.length, '\n');

    for (const collection of collections) {
      const collName = collection.name;
      const coll = db.collection(collName);
      const count = await coll.countDocuments();
      const docs = await coll.find({}).limit(5).toArray();
      
      console.log(`\n${'='.repeat(50)}`);
      console.log(`Collection: ${collName}`);
      console.log(`Total documents: ${count}`);
      console.log(`${'='.repeat(50)}`);
      
      if (docs.length > 0) {
        console.log(JSON.stringify(docs, null, 2));
      } else {
        console.log('(empty)');
      }
    }

    await mongoose.connection.close();
    console.log('\n✅ Connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

retrieveData();
