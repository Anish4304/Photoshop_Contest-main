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

const addArchitectureImages = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const db = mongoose.connection.db;
  
  // Get Architecture category
  const archCategory = await db.collection('categories').findOne({ name: 'Architecture' });
  
  if (!archCategory) {
    console.log('❌ Architecture category not found');
    process.exit(1);
  }

  // Get photos in Architecture category
  const archPhotos = await db.collection('photos').find({ categoryId: archCategory._id }).toArray();
  
  console.log(`Found ${archPhotos.length} Architecture photos`);
  console.log('📥 Downloading images...\n');

  const uploadsDir = path.join(__dirname, 'uploads');
  
  for (let i = 0; i < archPhotos.length; i++) {
    const photo = archPhotos[i];
    const filename = path.basename(photo.imageUrl);
    const imageId = 300 + i;
    const imageUrl = `https://picsum.photos/id/${imageId}/1200/800`;
    
    try {
      await downloadImage(imageUrl, path.join(uploadsDir, filename));
      console.log(`✅ Downloaded ${filename}`);
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.log(`⚠️  Failed ${filename}`);
    }
  }

  console.log('\n✅ All Architecture images downloaded!');
  
  await mongoose.connection.close();
  process.exit(0);
};

addArchitectureImages();
