const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const MONGODB_URI = 'mongodb://localhost:27017/photoshop_contest';

const generateRealisticImage = (filename, title, category) => {
  const canvas = createCanvas(1200, 800);
  const ctx = canvas.getContext('2d');
  
  // Category-specific gradients and themes
  const themes = {
    'Nature': {
      colors: ['#1a472a', '#2d5016', '#4a7c59', '#6b9080'],
      patterns: ['mountains', 'trees', 'sky']
    },
    'Portrait': {
      colors: ['#8b4513', '#a0522d', '#cd853f', '#deb887'],
      patterns: ['face', 'silhouette']
    },
    'Wildlife': {
      colors: ['#2c5f2d', '#97bc62', '#4a7c59', '#1a472a'],
      patterns: ['animals', 'nature']
    },
    'Street': {
      colors: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6'],
      patterns: ['buildings', 'urban']
    }
  };
  
  const theme = themes[category] || themes['Nature'];
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
  gradient.addColorStop(0, theme.colors[0]);
  gradient.addColorStop(0.5, theme.colors[1]);
  gradient.addColorStop(1, theme.colors[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 800);
  
  // Add texture/pattern based on category
  if (category === 'Nature') {
    // Mountains
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, 800);
    ctx.lineTo(300, 400);
    ctx.lineTo(600, 500);
    ctx.lineTo(900, 350);
    ctx.lineTo(1200, 600);
    ctx.lineTo(1200, 800);
    ctx.fill();
    
    // Sun/Moon
    ctx.fillStyle = 'rgba(255, 200, 100, 0.8)';
    ctx.beginPath();
    ctx.arc(900, 200, 80, 0, Math.PI * 2);
    ctx.fill();
  } else if (category === 'Portrait') {
    // Face silhouette
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(600, 400, 200, 280, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (category === 'Wildlife') {
    // Animal silhouette
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.ellipse(600, 450, 250, 180, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(500, 350, 100, 120, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (category === 'Street') {
    // Buildings
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(100, 400, 150, 400);
    ctx.fillRect(300, 300, 200, 500);
    ctx.fillRect(550, 350, 180, 450);
    ctx.fillRect(780, 250, 220, 550);
    ctx.fillRect(1050, 400, 150, 400);
  }
  
  // Add vignette effect
  const vignette = ctx.createRadialGradient(600, 400, 200, 600, 400, 800);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, 1200, 800);
  
  // Add title overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 650, 1200, 150);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(title, 600, 720);
  
  ctx.font = '28px Arial';
  ctx.fillStyle = '#cccccc';
  ctx.fillText(category, 600, 760);
  
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  const filepath = path.join(__dirname, 'uploads', filename);
  fs.writeFileSync(filepath, buffer);
  console.log(`✅ Created: ${filename} - ${title} (${category})`);
};

const generateImages = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const db = mongoose.connection.db;
    const photos = await db.collection('photos').find({}).toArray();
    const categories = await db.collection('categories').find({}).toArray();
    
    console.log(`Generating realistic images for ${photos.length} photos\n`);

    for (const photo of photos) {
      const filename = path.basename(photo.imageUrl);
      const category = categories.find(c => c._id.toString() === photo.categoryId.toString());
      const categoryName = category ? category.name : 'Nature';
      
      generateRealisticImage(filename, photo.title, categoryName);
    }

    console.log('\n✅ All realistic images generated successfully!');
    console.log(`📁 Location: ${uploadsDir}`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

generateImages();
