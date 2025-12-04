const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

const seedForAnalytics = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const db = mongoose.connection.db;
  
  // Clear all collections
  await db.collection('photographers').deleteMany({});
  await db.collection('judges').deleteMany({});
  await db.collection('categories').deleteMany({});
  await db.collection('photos').deleteMany({});
  await db.collection('galleries').deleteMany({});
  await db.collection('judgescores').deleteMany({});
  await db.collection('visitors').deleteMany({});
  await db.collection('visitorvotes').deleteMany({});
  await db.collection('winners').deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create 4 categories
  const categories = await db.collection('categories').insertMany([
    { name: 'Nature', description: 'Beautiful landscapes', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Portrait', description: 'Human emotions', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Wildlife', description: 'Animals in habitat', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Street', description: 'Urban life', createdAt: new Date(), updatedAt: new Date() },
  ]);
  const catIds = Object.values(categories.insertedIds);
  console.log('✅ Created 4 categories');

  // Create 8 photographers (some will submit to multiple categories)
  const photographers = await db.collection('photographers').insertMany([
    { name: 'John Doe', email: 'john@photo.com', password: hashedPassword, phone: '+1111111111', bio: 'Nature specialist', role: 'photographer', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Jane Smith', email: 'jane@photo.com', password: hashedPassword, phone: '+2222222222', bio: 'Portrait expert', role: 'photographer', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Mike Johnson', email: 'mike@photo.com', password: hashedPassword, phone: '+3333333333', bio: 'Wildlife photographer', role: 'photographer', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Sarah Williams', email: 'sarah@photo.com', password: hashedPassword, phone: '+4444444444', bio: 'Street photographer', role: 'photographer', createdAt: new Date(), updatedAt: new Date() },
    { name: 'David Brown', email: 'david@photo.com', password: hashedPassword, phone: '+5555555555', bio: 'Multi-genre photographer', role: 'photographer', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Emma Davis', email: 'emma@photo.com', password: hashedPassword, phone: '+6666666666', bio: 'All-rounder', role: 'photographer', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Alex Wilson', email: 'alex@photo.com', password: hashedPassword, phone: '+7777777777', bio: 'Versatile artist', role: 'photographer', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Lisa Anderson', email: 'lisa@photo.com', password: hashedPassword, phone: '+8888888888', bio: 'Creative photographer', role: 'photographer', createdAt: new Date(), updatedAt: new Date() },
  ]);
  const photIds = Object.values(photographers.insertedIds);
  console.log('✅ Created 8 photographers');

  // Create 5 judges (some will score >20 entries)
  const judges = await db.collection('judges').insertMany([
    { name: 'Judge Emily', email: 'emily@judge.com', password: hashedPassword, expertise: 'Landscape', role: 'judge', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Judge Robert', email: 'robert@judge.com', password: hashedPassword, expertise: 'Portrait', role: 'judge', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Judge Maria', email: 'maria@judge.com', password: hashedPassword, expertise: 'Wildlife', role: 'judge', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Judge Thomas', email: 'thomas@judge.com', password: hashedPassword, expertise: 'Street', role: 'judge', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Judge Anna', email: 'anna@judge.com', password: hashedPassword, expertise: 'General', role: 'judge', createdAt: new Date(), updatedAt: new Date() },
  ]);
  const judgeIds = Object.values(judges.insertedIds);
  console.log('✅ Created 5 judges');

  // Create 60 photos (15 per category to test >50 threshold)
  const photoData = [];
  let photoIndex = 1;
  
  // Nature - 15 photos
  for (let i = 0; i < 15; i++) {
    photoData.push({
      title: `Nature Photo ${i + 1}`,
      description: `Beautiful nature scene ${i + 1}`,
      imageUrl: `/uploads/photo${photoIndex}.jpg`,
      photographerId: photIds[i % 8],
      categoryId: catIds[0],
      galleries: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    photoIndex++;
  }
  
  // Portrait - 15 photos
  for (let i = 0; i < 15; i++) {
    photoData.push({
      title: `Portrait Photo ${i + 1}`,
      description: `Stunning portrait ${i + 1}`,
      imageUrl: `/uploads/photo${photoIndex}.jpg`,
      photographerId: photIds[i % 8],
      categoryId: catIds[1],
      galleries: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    photoIndex++;
  }
  
  // Wildlife - 15 photos
  for (let i = 0; i < 15; i++) {
    photoData.push({
      title: `Wildlife Photo ${i + 1}`,
      description: `Amazing wildlife ${i + 1}`,
      imageUrl: `/uploads/photo${photoIndex}.jpg`,
      photographerId: photIds[i % 8],
      categoryId: catIds[2],
      galleries: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    photoIndex++;
  }
  
  // Street - 15 photos
  for (let i = 0; i < 15; i++) {
    photoData.push({
      title: `Street Photo ${i + 1}`,
      description: `Urban scene ${i + 1}`,
      imageUrl: `/uploads/photo${photoIndex}.jpg`,
      photographerId: photIds[i % 8],
      categoryId: catIds[3],
      galleries: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    photoIndex++;
  }

  const photos = await db.collection('photos').insertMany(photoData);
  const photoIds = Object.values(photos.insertedIds);
  console.log('✅ Created 60 photos (15 per category)');

  // Create 3 galleries with some photos in multiple galleries
  const galleries = await db.collection('galleries').insertMany([
    { name: 'Best of Nature', description: 'Top nature photos', photos: [photoIds[0], photoIds[1], photoIds[15], photoIds[30]], createdAt: new Date(), updatedAt: new Date() },
    { name: 'Portrait Masters', description: 'Best portraits', photos: [photoIds[15], photoIds[16], photoIds[17]], createdAt: new Date(), updatedAt: new Date() },
    { name: 'Editors Choice', description: 'Staff picks', photos: [photoIds[0], photoIds[15], photoIds[30], photoIds[45]], createdAt: new Date(), updatedAt: new Date() },
  ]);
  const galleryIds = Object.values(galleries.insertedIds);
  
  // Update photos with gallery references
  await db.collection('photos').updateOne({ _id: photoIds[0] }, { $set: { galleries: [galleryIds[0], galleryIds[2]] } });
  await db.collection('photos').updateOne({ _id: photoIds[15] }, { $set: { galleries: [galleryIds[0], galleryIds[1], galleryIds[2]] } });
  await db.collection('photos').updateOne({ _id: photoIds[30] }, { $set: { galleries: [galleryIds[0], galleryIds[2]] } });
  console.log('✅ Created 3 galleries');

  // Create judge scores (all judges score all photos = 60*5 = 300 scores)
  const judgeScores = [];
  for (const photoId of photoIds) {
    for (const judgeId of judgeIds) {
      judgeScores.push({
        judgeId,
        photoId,
        score: Math.floor(Math.random() * 5) + 6, // 6-10
        comment: 'Great work',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
  await db.collection('judgescores').insertMany(judgeScores);
  console.log('✅ Created 300 judge scores (all judges scored all photos)');

  // Create 15 visitors (some will vote >10 times)
  const visitors = await db.collection('visitors').insertMany([
    { name: 'Visitor 1', email: 'v1@visitor.com', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Visitor 2', email: 'v2@visitor.com', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Visitor 3', email: 'v3@visitor.com', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Visitor 4', email: 'v4@visitor.com', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Visitor 5', email: 'v5@visitor.com', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Visitor 6', email: 'v6@visitor.com', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Visitor 7', email: 'v7@visitor.com', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Visitor 8', email: 'v8@visitor.com', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Visitor 9', email: 'v9@visitor.com', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Visitor 10', email: 'v10@visitor.com', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Visitor 11', email: 'v11@visitor.com', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Visitor 12', email: 'v12@visitor.com', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Visitor 13', email: 'v13@visitor.com', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Visitor 14', email: 'v14@visitor.com', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Visitor 15', email: 'v15@visitor.com', createdAt: new Date(), updatedAt: new Date() },
  ]);
  const visitorIds = Object.values(visitors.insertedIds);
  console.log('✅ Created 15 visitors');

  // Create visitor votes (some visitors vote >10 times)
  const visitorVotes = [];
  for (let i = 0; i < visitorIds.length; i++) {
    const voteCount = i < 5 ? Math.floor(Math.random() * 10) + 15 : Math.floor(Math.random() * 8) + 3; // First 5 vote >10
    const votedPhotos = new Set();
    for (let j = 0; j < voteCount; j++) {
      const randomPhotoIndex = Math.floor(Math.random() * photoIds.length);
      if (!votedPhotos.has(randomPhotoIndex)) {
        votedPhotos.add(randomPhotoIndex);
        visitorVotes.push({
          visitorId: visitorIds[i],
          photoId: photoIds[randomPhotoIndex],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
  }
  await db.collection('visitorvotes').insertMany(visitorVotes);
  console.log(`✅ Created ${visitorVotes.length} visitor votes`);

  // Calculate winners (top 3 per category)
  const winners = [];
  for (let catIndex = 0; catIndex < 4; catIndex++) {
    const categoryPhotos = photoIds.slice(catIndex * 15, (catIndex + 1) * 15);
    const photoScores = [];
    
    for (const photoId of categoryPhotos) {
      const judgeScoreSum = judgeScores.filter(s => s.photoId.toString() === photoId.toString()).reduce((sum, s) => sum + s.score, 0);
      const voteCount = visitorVotes.filter(v => v.photoId.toString() === photoId.toString()).length;
      photoScores.push({ photoId, totalScore: judgeScoreSum + voteCount });
    }
    
    photoScores.sort((a, b) => b.totalScore - a.totalScore);
    
    for (let i = 0; i < 3; i++) {
      winners.push({
        photoId: photoScores[i].photoId,
        categoryId: catIds[catIndex],
        position: i + 1,
        totalScore: photoScores[i].totalScore,
        announcement: `Winner position ${i + 1}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
  await db.collection('winners').insertMany(winners);
  console.log('✅ Created 12 winners (top 3 per category)');

  // Download realistic images
  console.log('\n📥 Downloading realistic images...');
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  for (let i = 1; i <= 60; i++) {
    const imageId = 10 + i;
    const imageUrl = `https://picsum.photos/id/${imageId}/1200/800`;
    try {
      await downloadImage(imageUrl, path.join(uploadsDir, `photo${i}.jpg`));
      console.log(`✅ Downloaded photo${i}.jpg`);
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.log(`⚠️  Failed photo${i}.jpg`);
    }
  }

  console.log('\n✅ All done!');
  console.log('\n📊 Summary:');
  console.log('- 4 categories');
  console.log('- 8 photographers');
  console.log('- 5 judges');
  console.log('- 60 photos (15 per category)');
  console.log('- 3 galleries');
  console.log('- 300 judge scores');
  console.log('- 15 visitors');
  console.log(`- ${visitorVotes.length} visitor votes`);
  console.log('- 12 winners');
  
  await mongoose.connection.close();
  process.exit(0);
};

seedForAnalytics();
