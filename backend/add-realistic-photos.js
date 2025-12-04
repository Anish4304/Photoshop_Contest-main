const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/photography_contest')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const photoSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  photographerId: mongoose.Schema.Types.ObjectId,
  categoryId: mongoose.Schema.Types.ObjectId,
  galleries: [mongoose.Schema.Types.ObjectId],
  createdAt: Date,
  updatedAt: Date
});

const Photo = mongoose.model('Photo', photoSchema);

// Unsplash-like placeholder images (using picsum.photos)
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
};

const addRealisticPhotos = async () => {
  try {
    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get existing data using models
    const Photographer = mongoose.model('Photographer', new mongoose.Schema({}, { strict: false }));
    const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
    
    const photographers = await Photographer.find().lean();
    const categories = await Category.find().lean();
    
    if (photographers.length === 0 || categories.length === 0) {
      console.log('Please run seed script first!');
      process.exit(1);
    }

    const natureCategory = categories.find(c => c.name === 'Nature');
    const portraitCategory = categories.find(c => c.name === 'Portrait');
    const wildlifeCategory = categories.find(c => c.name === 'Wildlife');
    const streetCategory = categories.find(c => c.name === 'Street');

    // Photo data with realistic titles and descriptions
    const newPhotos = [
      // Nature photos (8 more)
      { title: 'Golden Autumn Forest', description: 'Vibrant fall colors in a peaceful forest', category: natureCategory._id, seed: 101 },
      { title: 'Misty Mountain Peak', description: 'Early morning fog rolling over mountain peaks', category: natureCategory._id, seed: 102 },
      { title: 'Crystal Clear Lake', description: 'Reflection of mountains in pristine water', category: natureCategory._id, seed: 103 },
      { title: 'Desert Sand Dunes', description: 'Golden hour light on desert landscape', category: natureCategory._id, seed: 104 },
      { title: 'Waterfall Paradise', description: 'Cascading waterfall in tropical rainforest', category: natureCategory._id, seed: 105 },
      { title: 'Northern Lights', description: 'Aurora borealis dancing in the night sky', category: natureCategory._id, seed: 106 },
      { title: 'Cherry Blossom Spring', description: 'Pink cherry blossoms in full bloom', category: natureCategory._id, seed: 107 },
      { title: 'Rocky Coastline', description: 'Dramatic cliffs meeting the ocean', category: natureCategory._id, seed: 108 },
      
      // Portrait photos (7 more)
      { title: 'Urban Professional', description: 'Business portrait in modern setting', category: portraitCategory._id, seed: 201 },
      { title: 'Childhood Joy', description: 'Candid moment of pure happiness', category: portraitCategory._id, seed: 202 },
      { title: 'Elderly Wisdom', description: 'Portrait capturing life experience', category: portraitCategory._id, seed: 203 },
      { title: 'Fashion Forward', description: 'High fashion editorial portrait', category: portraitCategory._id, seed: 204 },
      { title: 'Natural Beauty', description: 'Outdoor portrait with natural lighting', category: portraitCategory._id, seed: 205 },
      { title: 'Artist at Work', description: 'Creative professional in their element', category: portraitCategory._id, seed: 206 },
      { title: 'Cultural Heritage', description: 'Traditional dress and customs', category: portraitCategory._id, seed: 207 },
      
      // Wildlife photos (7 more)
      { title: 'Majestic Elephant', description: 'African elephant in natural habitat', category: wildlifeCategory._id, seed: 301 },
      { title: 'Polar Bear Hunt', description: 'Arctic predator on ice', category: wildlifeCategory._id, seed: 302 },
      { title: 'Butterfly Close-up', description: 'Macro shot of colorful butterfly', category: wildlifeCategory._id, seed: 303 },
      { title: 'Dolphin Pod', description: 'Dolphins swimming in crystal waters', category: wildlifeCategory._id, seed: 304 },
      { title: 'Tiger Portrait', description: 'Intense gaze of Bengal tiger', category: wildlifeCategory._id, seed: 305 },
      { title: 'Hummingbird Flight', description: 'Frozen moment of hovering bird', category: wildlifeCategory._id, seed: 306 },
      { title: 'Wolf Pack', description: 'Wolves in winter landscape', category: wildlifeCategory._id, seed: 307 },
      
      // Street photos (6 more)
      { title: 'Tokyo Night Lights', description: 'Neon signs in busy district', category: streetCategory._id, seed: 401 },
      { title: 'Market Day', description: 'Bustling local market scene', category: streetCategory._id, seed: 402 },
      { title: 'Subway Rush', description: 'Commuters in motion', category: streetCategory._id, seed: 403 },
      { title: 'Street Musician', description: 'Artist performing for passersby', category: streetCategory._id, seed: 404 },
      { title: 'Rainy Evening', description: 'Reflections on wet city streets', category: streetCategory._id, seed: 405 },
      { title: 'Graffiti Art', description: 'Urban art on city walls', category: streetCategory._id, seed: 406 }
    ];

    console.log(`\nDownloading ${newPhotos.length} realistic images...`);
    
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    let count = 12; // Start from 12 since we have 11 existing + 1 uploaded
    
    for (const photoData of newPhotos) {
      count++;
      const filename = `photo-${count}.jpg`;
      const filepath = path.join(uploadsDir, filename);
      
      // Download from picsum.photos (free placeholder images)
      const imageUrl = `https://picsum.photos/seed/${photoData.seed}/800/600`;
      
      try {
        await downloadImage(imageUrl, filepath);
        
        // Random photographer
        const photographer = photographers[Math.floor(Math.random() * photographers.length)];
        
        // Create photo document
        await Photo.create({
          title: photoData.title,
          description: photoData.description,
          imageUrl: `/uploads/${filename}`,
          photographerId: photographer._id,
          categoryId: photoData.category,
          galleries: [],
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`✓ Added: ${photoData.title}`);
      } catch (error) {
        console.error(`✗ Failed: ${photoData.title}`, error.message);
      }
    }

    console.log(`\n✅ Successfully added ${newPhotos.length} realistic photos!`);
    console.log(`📊 Total photos in database: ${await Photo.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addRealisticPhotos();
