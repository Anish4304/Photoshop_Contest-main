const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/photoshop_contest')
  .then(async () => {
    const db = mongoose.connection.db;
    const photos = await db.collection('photos').find({}).toArray();
    console.log('Photos count:', photos.length);
    console.log('Photos:', JSON.stringify(photos, null, 2));
    process.exit(0);
  });
