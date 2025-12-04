const mongoose = require('mongoose');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = 'mongodb://localhost:27017/photoshop_contest';

const downloadImage = async (url, filepath) => {
  const response = await axios({ url, method: 'GET', responseType: 'stream' });
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const addMorePhotos = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const db = mongoose.connection.db;
  
  const categories = await db.collection('categories').find({}).toArray();
  const photographers = await db.collection('photographers').find({}).toArray();
  const judges = await db.collection('judges').find({}).toArray();
  const visitors = await db.collection('visitors').find({}).toArray();

  const catIds = categories.map(c => c._id);
  const photIds = photographers.map(p => p._id);
  const judgeIds = judges.map(j => j._id);
  const visitorIds = visitors.map(v => v._id);

  // Add 40 more photos to each category (total will be 55 per category)
  const photoData = [];
  let photoIndex = 61;
  
  for (let catIndex = 0; catIndex < 4; catIndex++) {
    for (let i = 0; i < 40; i++) {
      photoData.push({
        title: `${categories[catIndex].name} Photo ${16 + i}`,
        description: `Additional ${categories[catIndex].name.toLowerCase()} photo`,
        imageUrl: `/uploads/photo${photoIndex}.jpg`,
        photographerId: photIds[i % photIds.length],
        categoryId: catIds[catIndex],
        galleries: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      photoIndex++;
    }
  }

  const photos = await db.collection('photos').insertMany(photoData);
  const photoIds = Object.values(photos.insertedIds);
  console.log(`✅ Added 160 more photos (40 per category)`);

  // Add judge scores for new photos
  const judgeScores = [];
  for (const photoId of photoIds) {
    for (const judgeId of judgeIds) {
      judgeScores.push({
        judgeId,
        photoId,
        score: Math.floor(Math.random() * 5) + 6,
        comment: 'Great work',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
  await db.collection('judgescores').insertMany(judgeScores);
  console.log(`✅ Added ${judgeScores.length} judge scores`);

  // Add visitor votes
  const visitorVotes = [];
  for (const photoId of photoIds) {
    const voteCount = Math.floor(Math.random() * 5);
    for (let i = 0; i < voteCount; i++) {
      visitorVotes.push({
        visitorId: visitorIds[i % visitorIds.length],
        photoId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
  await db.collection('visitorvotes').insertMany(visitorVotes);
  console.log(`✅ Added ${visitorVotes.length} visitor votes`);

  // Download images
  console.log('\n📥 Downloading images...');
  const uploadsDir = path.join(__dirname, 'uploads');
  
  for (let i = 61; i <= 220; i++) {
    const imageId = 70 + i;
    const imageUrl = `https://picsum.photos/id/${imageId}/1200/800`;
    try {
      await downloadImage(imageUrl, path.join(uploadsDir, `photo${i}.jpg`));
      console.log(`✅ Downloaded photo${i}.jpg`);
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.log(`⚠️  Failed photo${i}.jpg`);
    }
  }

  const totalPhotos = await db.collection('photos').countDocuments();
  console.log(`\n✅ Total photos in database: ${totalPhotos}`);
  console.log('✅ Each category now has 55 photos (>50 threshold)');
  
  await mongoose.connection.close();
  process.exit(0);
};

addMorePhotos();
