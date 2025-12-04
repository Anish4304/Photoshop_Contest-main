const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/photography_contest')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const Photo = mongoose.model('Photo', new mongoose.Schema({}, { strict: false }));
    const Photographer = mongoose.model('Photographer', new mongoose.Schema({}, { strict: false }));
    const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
    const Gallery = mongoose.model('Gallery', new mongoose.Schema({}, { strict: false }));
    const JudgeScore = mongoose.model('JudgeScore', new mongoose.Schema({}, { strict: false }));
    const VisitorVote = mongoose.model('VisitorVote', new mongoose.Schema({}, { strict: false }));
    const Visitor = mongoose.model('Visitor', new mongoose.Schema({}, { strict: false }));
    const Winner = mongoose.model('Winner', new mongoose.Schema({}, { strict: false }));
    
    const categories = await Category.find();
    const photographers = await Photographer.find();
    const galleries = await Gallery.find();
    const judges = await mongoose.connection.db.collection('judges').find().toArray();
    const visitors = await Visitor.find();
    
    // Add 30 more photos to reach 60+ total
    const newPhotos = [];
    for (let i = 1; i <= 30; i++) {
      const catIndex = i % categories.length;
      const photogIndex = i % photographers.length;
      
      newPhotos.push({
        title: `Photo ${i}`,
        description: `Description for photo ${i}`,
        imageUrl: `https://images.unsplash.com/photo-${1500000000000 + i}?w=800`,
        photographerId: photographers[photogIndex]._id,
        categoryId: categories[catIndex]._id,
        galleries: i % 3 === 0 ? [galleries[i % galleries.length]._id] : [],
      });
    }
    
    const insertedPhotos = await Photo.insertMany(newPhotos);
    console.log(`Added ${insertedPhotos.length} photos`);
    
    // Add scores for all photos
    const allPhotos = await Photo.find();
    let scoreCount = 0;
    for (const photo of allPhotos) {
      for (const judge of judges) {
        const exists = await JudgeScore.findOne({ photoId: photo._id, judgeId: judge._id });
        if (!exists) {
          await JudgeScore.create({
            photoId: photo._id,
            judgeId: judge._id,
            score: Math.floor(Math.random() * 40) + 60, // 60-100
          });
          scoreCount++;
        }
      }
    }
    console.log(`Added ${scoreCount} judge scores`);
    
    // Add more votes
    let voteCount = 0;
    for (const visitor of visitors) {
      const randomPhotos = allPhotos.sort(() => 0.5 - Math.random()).slice(0, 15);
      for (const photo of randomPhotos) {
        const exists = await VisitorVote.findOne({ visitorId: visitor._id, photoId: photo._id });
        if (!exists) {
          await VisitorVote.create({
            visitorId: visitor._id,
            photoId: photo._id,
          });
          voteCount++;
        }
      }
    }
    console.log(`Added ${voteCount} visitor votes`);
    
    // Add more winners
    for (const category of categories) {
      const categoryPhotos = await Photo.find({ categoryId: category._id });
      const topPhotos = categoryPhotos.sort(() => 0.5 - Math.random()).slice(0, 3);
      
      for (let i = 0; i < topPhotos.length; i++) {
        const exists = await Winner.findOne({ photoId: topPhotos[i]._id, categoryId: category._id });
        if (!exists) {
          await Winner.create({
            photoId: topPhotos[i]._id,
            photographerId: topPhotos[i].photographerId,
            categoryId: category._id,
            position: i + 1,
            announcedAt: new Date(),
          });
        }
      }
    }
    console.log('Added winners for all categories');
    
    console.log('\nFinal counts:');
    console.log('Photos:', await Photo.countDocuments());
    console.log('Scores:', await JudgeScore.countDocuments());
    console.log('Votes:', await VisitorVote.countDocuments());
    console.log('Winners:', await Winner.countDocuments());
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
