const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = 'mongodb://localhost:27017/photoshop_contest';

// Create a colored placeholder image (PNG format)
const createColoredImage = (filename, color, text) => {
  const { createCanvas } = require('canvas');
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 800, 600);
  
  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 400, 300);
  
  const buffer = canvas.toBuffer('image/jpeg');
  const filepath = path.join(__dirname, 'uploads', filename);
  fs.writeFileSync(filepath, buffer);
  console.log(`✅ Created: ${filename}`);
};

// Simple fallback if canvas is not available
const createSimpleImage = (filename) => {
  const png = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x03, 0x20, 0x00, 0x00, 0x02, 0x58,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x15, 0x14, 0x15, 0x27,
    0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54,
    0x08, 0x99, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01,
    0x0D, 0x0A, 0x2D, 0xB4,
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
    0xAE, 0x42, 0x60, 0x82
  ]);
  
  const filepath = path.join(__dirname, 'uploads', filename);
  fs.writeFileSync(filepath, png);
  console.log(`✅ Created: ${filename}`);
};

const generateImages = async () => {
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
    
    console.log(`Found ${photos.length} photos to generate images for\n`);

    const categoryColors = {
      'Nature': '#2d5016',
      'Portrait': '#8b4513',
      'Wildlife': '#1a472a',
      'Street': '#2c3e50'
    };

    let useCanvas = true;
    try {
      require('canvas');
    } catch (e) {
      console.log('⚠️  Canvas module not found, using simple placeholders\n');
      useCanvas = false;
    }

    for (const photo of photos) {
      const filename = path.basename(photo.imageUrl);
      const category = categories.find(c => c._id.toString() === photo.categoryId.toString());
      const categoryName = category ? category.name : 'Unknown';
      const color = categoryColors[categoryName] || '#333333';
      
      if (useCanvas) {
        createColoredImage(filename, color, photo.title);
      } else {
        createSimpleImage(filename);
      }
    }

    console.log('\n✅ All images generated successfully!');
    console.log(`📁 Location: ${uploadsDir}`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

generateImages();
