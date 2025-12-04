const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  visitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true },
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true }
}, { timestamps: true });

mongoose.connect('mongodb://localhost:27017/photography_contest')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const Photo = mongoose.model('Photo', new mongoose.Schema({}, { strict: false }));
    const Visitor = mongoose.model('Visitor', new mongoose.Schema({}, { strict: false }));
    const Vote = mongoose.model('VisitorVote', voteSchema);
    
    // Get all photos
    const photos = await Photo.find();
    console.log(`Found ${photos.length} photos`);
    
    // Get or create 20 visitors
    const visitors = [];
    for (let i = 1; i <= 20; i++) {
      let visitor = await Visitor.findOne({ email: `visitor${i}@example.com` });
      if (!visitor) {
        visitor = await Visitor.create({
          name: `Visitor ${i}`,
          email: `visitor${i}@example.com`
        });
      }
      visitors.push(visitor);
    }
    console.log(`Using ${visitors.length} visitors`);
    
    // Add random votes (each visitor votes for 5-15 random photos)
    let totalVotes = 0;
    for (const visitor of visitors) {
      const numVotes = Math.floor(Math.random() * 11) + 5; // 5-15 votes
      const shuffled = [...photos].sort(() => Math.random() - 0.5);
      const photosToVote = shuffled.slice(0, numVotes);
      
      for (const photo of photosToVote) {
        await Vote.create({
          visitorId: visitor._id,
          photoId: photo._id
        });
        totalVotes++;
      }
    }
    
    console.log(`Added ${totalVotes} votes`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
