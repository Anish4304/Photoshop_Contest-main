const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/photoshop_contest';

const seedAndGenerate = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB...');

  const db = mongoose.connection.db;
  
  // Clear
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

  // Categories
  const categories = await db.collection('categories').insertMany([
    { name: 'Nature', description: 'Beautiful landscapes and nature photography', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Portrait', description: 'Capturing human emotions and expressions', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Wildlife', description: 'Animals in their natural habitat', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Street', description: 'Candid moments from urban life', createdAt: new Date(), updatedAt: new Date() },
  ]);

  // Photographers
  const photographers = await db.collection('photographers').insertMany([
    { name: 'John Doe', email: 'john@photographer.com', password: hashedPassword, phone: '+1234567890', bio: 'Professional nature photographer', role: 'photographer', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Jane Smith', email: 'jane@photographer.com', password: hashedPassword, phone: '+1234567891', bio: 'Portrait specialist', role: 'photographer', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Mike Johnson', email: 'mike@photographer.com', password: hashedPassword, phone: '+1234567892', bio: 'Wildlife photographer', role: 'photographer', createdAt: new Date(), updatedAt: new Date() },
  ]);

  const catIds = Object.values(categories.insertedIds);
  const photIds = Object.values(photographers.insertedIds);

  // Photos
  const photos = await db.collection('photos').insertMany([
    { title: 'Sunset over Mountains', description: 'A breathtaking sunset view', imageUrl: '/uploads/sample1.jpg', photographerId: photIds[0], categoryId: catIds[0], galleries: [], createdAt: new Date(), updatedAt: new Date() },
    { title: 'Forest Stream', description: 'A peaceful stream', imageUrl: '/uploads/sample2.jpg', photographerId: photIds[0], categoryId: catIds[0], galleries: [], createdAt: new Date(), updatedAt: new Date() },
    { title: 'The Smile', description: 'Capturing genuine happiness', imageUrl: '/uploads/sample3.jpg', photographerId: photIds[1], categoryId: catIds[1], galleries: [], createdAt: new Date(), updatedAt: new Date() },
    { title: 'Contemplation', description: 'A moment of deep thought', imageUrl: '/uploads/sample4.jpg', photographerId: photIds[1], categoryId: catIds[1], galleries: [], createdAt: new Date(), updatedAt: new Date() },
    { title: 'Lion Pride', description: 'A majestic lion family', imageUrl: '/uploads/sample5.jpg', photographerId: photIds[2], categoryId: catIds[2], galleries: [], createdAt: new Date(), updatedAt: new Date() },
    { title: 'Eagle in Flight', description: 'An eagle soaring', imageUrl: '/uploads/sample6.jpg', photographerId: photIds[2], categoryId: catIds[2], galleries: [], createdAt: new Date(), updatedAt: new Date() },
    { title: 'Urban Rush', description: 'City life in motion', imageUrl: '/uploads/sample7.jpg', photographerId: photIds[0], categoryId: catIds[3], galleries: [], createdAt: new Date(), updatedAt: new Date() },
    { title: 'Street Vendor', description: 'A hardworking vendor', imageUrl: '/uploads/sample8.jpg', photographerId: photIds[1], categoryId: catIds[3], galleries: [], createdAt: new Date(), updatedAt: new Date() },
  ]);

  console.log(`✅ Created ${Object.keys(photos.insertedIds).length} photos`);

  // Now generate images
  const { createCanvas } = require('canvas');
  const fs = require('fs');
  const path = require('path');

  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const photoList = await db.collection('photos').find({}).toArray();
  const catList = await db.collection('categories').find({}).toArray();

  const themes = {
    'Nature': { colors: ['#1a472a', '#2d5016', '#4a7c59'], pattern: 'mountains' },
    'Portrait': { colors: ['#8b4513', '#a0522d', '#cd853f'], pattern: 'face' },
    'Wildlife': { colors: ['#2c5f2d', '#97bc62', '#4a7c59'], pattern: 'animal' },
    'Street': { colors: ['#2c3e50', '#34495e', '#7f8c8d'], pattern: 'buildings' }
  };

  for (const photo of photoList) {
    const filename = path.basename(photo.imageUrl);
    const category = catList.find(c => c._id.toString() === photo.categoryId.toString());
    const categoryName = category ? category.name : 'Nature';
    const theme = themes[categoryName];

    const canvas = createCanvas(1200, 800);
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
    gradient.addColorStop(0, theme.colors[0]);
    gradient.addColorStop(0.5, theme.colors[1]);
    gradient.addColorStop(1, theme.colors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 800);

    if (categoryName === 'Nature') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, 800);
      ctx.lineTo(300, 400);
      ctx.lineTo(600, 500);
      ctx.lineTo(900, 350);
      ctx.lineTo(1200, 600);
      ctx.lineTo(1200, 800);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 200, 100, 0.8)';
      ctx.beginPath();
      ctx.arc(900, 200, 80, 0, Math.PI * 2);
      ctx.fill();
    } else if (categoryName === 'Portrait') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(600, 400, 200, 280, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (categoryName === 'Wildlife') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.ellipse(600, 450, 250, 180, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(500, 350, 100, 120, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (categoryName === 'Street') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(100, 400, 150, 400);
      ctx.fillRect(300, 300, 200, 500);
      ctx.fillRect(550, 350, 180, 450);
      ctx.fillRect(780, 250, 220, 550);
    }

    const vignette = ctx.createRadialGradient(600, 400, 200, 600, 400, 800);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, 1200, 800);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 650, 1200, 150);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(photo.title, 600, 720);
    ctx.font = '28px Arial';
    ctx.fillStyle = '#cccccc';
    ctx.fillText(categoryName, 600, 760);

    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);
    console.log(`✅ Generated: ${filename}`);
  }

  console.log('\n✅ All done!');
  await mongoose.connection.close();
  process.exit(0);
};

seedAndGenerate();
