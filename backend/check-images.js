const mongoose = require('mongoose');
require('dotenv').config();

const checkPhotos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const Photo = mongoose.model('Photo', new mongoose.Schema({
      title: String,
      imageUrl: String,
    }), 'photos');
    
    const photos = await Photo.find().select('title imageUrl').limit(5);
    
    console.log('\n📸 Photos in Database:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (photos.length === 0) {
      console.log('❌ No photos found in database');
    } else {
      photos.forEach((photo, i) => {
        console.log(`\n${i + 1}. ${photo.title}`);
        console.log(`   imageUrl: ${photo.imageUrl}`);
      });
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkPhotos();
