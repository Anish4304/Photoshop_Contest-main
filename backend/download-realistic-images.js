const mongoose = require('mongoose');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = 'mongodb://localhost:27017/photoshop_contest';

const downloadImage = async (url, filepath) => {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });
  
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const downloadRealisticImages = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const db = mongoose.connection.db;
    const photos = await db.collection('photos').find({}).toArray();
    const categories = await db.collection('categories').find({}).toArray();

    console.log(`Downloading realistic images for ${photos.length} photos\n`);

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const filename = path.basename(photo.imageUrl);
      const category = categories.find(c => c._id.toString() === photo.categoryId.toString());
      const categoryName = category ? category.name : 'Nature';
      
      // Using Picsum Photos (Lorem Picsum) - realistic stock photos
      const imageIds = [10, 20, 30, 40, 50, 60, 70, 80, 90, 91, 92];
      const imageId = imageIds[i] || (10 + i);
      const imageUrl = `https://picsum.photos/id/${imageId}/1200/800`;
      
      try {
        await downloadImage(imageUrl, path.join(uploadsDir, filename));
        console.log(`✅ Downloaded: ${filename} - ${photo.title} (${categoryName})`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.log(`⚠️  Failed to download ${filename}: ${error.message}`);
      }
    }

    console.log('\n✅ All realistic images downloaded successfully!');
    console.log(`📁 Location: ${uploadsDir}`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

downloadRealisticImages();
