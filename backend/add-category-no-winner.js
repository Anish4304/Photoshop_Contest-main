const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/photoshop_contest';

const addCategoryNoWinner = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const db = mongoose.connection.db;
  
  // Add new category without winners
  const newCategory = await db.collection('categories').insertOne({
    name: 'Architecture',
    description: 'Buildings and architectural photography',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log('✅ Added new category: Architecture');
  
  // Add some photos to this category (but no winners)
  const photographers = await db.collection('photographers').find({}).toArray();
  const photIds = photographers.map(p => p._id);
  
  const photoData = [];
  for (let i = 1; i <= 10; i++) {
    photoData.push({
      title: `Architecture Photo ${i}`,
      description: `Beautiful architecture ${i}`,
      imageUrl: `/uploads/arch${i}.jpg`,
      photographerId: photIds[i % photIds.length],
      categoryId: newCategory.insertedId,
      galleries: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  await db.collection('photos').insertMany(photoData);
  console.log('✅ Added 10 photos to Architecture category');
  console.log('✅ No winners assigned to this category');
  
  const totalCategories = await db.collection('categories').countDocuments();
  const categoriesWithWinners = await db.collection('winners').distinct('categoryId');
  
  console.log(`\n📊 Total categories: ${totalCategories}`);
  console.log(`📊 Categories with winners: ${categoriesWithWinners.length}`);
  console.log(`📊 Categories without winners: ${totalCategories - categoriesWithWinners.length}`);
  
  await mongoose.connection.close();
  process.exit(0);
};

addCategoryNoWinner();
