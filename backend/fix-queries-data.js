const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/photography_contest')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const Photo = mongoose.model('Photo', new mongoose.Schema({}, { strict: false }));
    const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
    const Gallery = mongoose.model('Gallery', new mongoose.Schema({}, { strict: false }));
    const Photographer = mongoose.model('Photographer', new mongoose.Schema({}, { strict: false }));
    const Winner = mongoose.model('Winner', new mongoose.Schema({}, { strict: false }));
    
    const categories = await Category.find();
    const galleries = await Gallery.find();
    const photographers = await Photographer.find();
    
    // Query 3: Add more photos to reach 50+ per category
    console.log('\n=== Query 3: Categories with 50+ submissions ===');
    for (const category of categories) {
      const count = await Photo.countDocuments({ categoryId: category._id });
      console.log(`${category.name}: ${count} photos`);
      
      if (count < 55) {
        const needed = 55 - count;
        const newPhotos = [];
        for (let i = 0; i < needed; i++) {
          newPhotos.push({
            title: `${category.name} Photo ${count + i + 1}`,
            description: `Beautiful ${category.name.toLowerCase()} photography`,
            imageUrl: `https://images.unsplash.com/photo-${1600000000000 + Math.floor(Math.random() * 100000)}?w=800`,
            photographerId: photographers[i % photographers.length]._id,
            categoryId: category._id,
            galleries: [],
          });
        }
        await Photo.insertMany(newPhotos);
        console.log(`Added ${needed} photos to ${category.name}`);
      }
    }
    
    // Query 6: Add photos to multiple galleries
    console.log('\n=== Query 6: Photos in multiple galleries ===');
    const allPhotos = await Photo.find();
    let multiGalleryCount = 0;
    for (let i = 0; i < 15; i++) {
      const photo = allPhotos[i];
      photo.galleries = [galleries[0]._id, galleries[1]._id];
      await photo.save();
      multiGalleryCount++;
    }
    console.log(`Added ${multiGalleryCount} photos to multiple galleries`);
    
    // Query 8: Create a category with no winners
    console.log('\n=== Query 8: Categories with no winners ===');
    const newCategory = await Category.create({
      name: 'Abstract',
      description: 'Abstract and experimental photography',
    });
    
    // Add photos to this category
    const abstractPhotos = [];
    for (let i = 0; i < 10; i++) {
      abstractPhotos.push({
        title: `Abstract Art ${i + 1}`,
        description: 'Creative abstract photography',
        imageUrl: `https://images.unsplash.com/photo-${1550000000000 + i}?w=800`,
        photographerId: photographers[i % photographers.length]._id,
        categoryId: newCategory._id,
        galleries: [],
      });
    }
    await Photo.insertMany(abstractPhotos);
    console.log(`Created Abstract category with ${abstractPhotos.length} photos (no winners)`);
    
    console.log('\n=== Final Stats ===');
    console.log('Total photos:', await Photo.countDocuments());
    console.log('Total categories:', await Category.countDocuments());
    console.log('Total galleries:', await Gallery.countDocuments());
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
