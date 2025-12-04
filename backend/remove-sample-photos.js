const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/photography_contest')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const Photo = mongoose.model('Photo', new mongoose.Schema({}, { strict: false }));
    
    // Delete photos with placeholder/sample image URLs (the colored ones)
    const result = await Photo.deleteMany({
      imageUrl: { $regex: /^\/uploads\/sample\d+\.jpg$/ }
    });
    
    console.log(`Deleted ${result.deletedCount} sample photos`);
    
    // Show remaining count
    const remaining = await Photo.countDocuments();
    console.log(`Remaining photos: ${remaining}`);
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
