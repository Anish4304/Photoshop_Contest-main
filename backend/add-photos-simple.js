const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/photography_contest')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error:', err));

const photoSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  photographerId: mongoose.Schema.Types.ObjectId,
  categoryId: mongoose.Schema.Types.ObjectId,
  galleries: [mongoose.Schema.Types.ObjectId]
}, { timestamps: true });

const Photo = mongoose.model('Photo', photoSchema);
const Photographer = mongoose.model('Photographer', new mongoose.Schema({}, { strict: false }));
const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }));

const addPhotos = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const photographers = await Photographer.find().lean();
    const categories = await Category.find().lean();
    
    const nature = categories.find(c => c.name === 'Nature');
    const portrait = categories.find(c => c.name === 'Portrait');
    const wildlife = categories.find(c => c.name === 'Wildlife');
    const street = categories.find(c => c.name === 'Street');

    const photos = [
      // Nature (8)
      { title: 'Golden Autumn Forest', desc: 'Vibrant fall colors', cat: nature._id, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800' },
      { title: 'Misty Mountain Peak', desc: 'Morning fog over peaks', cat: nature._id, img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
      { title: 'Crystal Clear Lake', desc: 'Mountain reflection', cat: nature._id, img: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800' },
      { title: 'Desert Sand Dunes', desc: 'Golden hour desert', cat: nature._id, img: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800' },
      { title: 'Waterfall Paradise', desc: 'Tropical waterfall', cat: nature._id, img: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800' },
      { title: 'Northern Lights', desc: 'Aurora borealis', cat: nature._id, img: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800' },
      { title: 'Cherry Blossom', desc: 'Spring blossoms', cat: nature._id, img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800' },
      { title: 'Rocky Coastline', desc: 'Cliffs and ocean', cat: nature._id, img: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800' },
      
      // Portrait (7)
      { title: 'Urban Professional', desc: 'Business portrait', cat: portrait._id, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800' },
      { title: 'Childhood Joy', desc: 'Happy moment', cat: portrait._id, img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800' },
      { title: 'Elderly Wisdom', desc: 'Life experience', cat: portrait._id, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800' },
      { title: 'Fashion Forward', desc: 'Editorial portrait', cat: portrait._id, img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800' },
      { title: 'Natural Beauty', desc: 'Outdoor portrait', cat: portrait._id, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800' },
      { title: 'Artist at Work', desc: 'Creative professional', cat: portrait._id, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800' },
      { title: 'Cultural Heritage', desc: 'Traditional dress', cat: portrait._id, img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800' },
      
      // Wildlife (7)
      { title: 'Majestic Elephant', desc: 'African elephant', cat: wildlife._id, img: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800' },
      { title: 'Polar Bear', desc: 'Arctic predator', cat: wildlife._id, img: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800' },
      { title: 'Butterfly Macro', desc: 'Colorful butterfly', cat: wildlife._id, img: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800' },
      { title: 'Dolphin Pod', desc: 'Swimming dolphins', cat: wildlife._id, img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800' },
      { title: 'Tiger Portrait', desc: 'Bengal tiger', cat: wildlife._id, img: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800' },
      { title: 'Hummingbird', desc: 'Hovering bird', cat: wildlife._id, img: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800' },
      { title: 'Wolf Pack', desc: 'Winter wolves', cat: wildlife._id, img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800' },
      
      // Street (6)
      { title: 'Tokyo Nights', desc: 'Neon lights', cat: street._id, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800' },
      { title: 'Market Day', desc: 'Local market', cat: street._id, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800' },
      { title: 'Subway Rush', desc: 'Commuters', cat: street._id, img: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800' },
      { title: 'Street Musician', desc: 'Artist performing', cat: street._id, img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800' },
      { title: 'Rainy Evening', desc: 'Wet streets', cat: street._id, img: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800' },
      { title: 'Graffiti Art', desc: 'Urban art', cat: street._id, img: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800' }
    ];

    console.log(`\nAdding ${photos.length} photos with Unsplash URLs...\n`);
    
    for (const p of photos) {
      const photographer = photographers[Math.floor(Math.random() * photographers.length)];
      await Photo.create({
        title: p.title,
        description: p.desc,
        imageUrl: p.img,
        photographerId: photographer._id,
        categoryId: p.cat,
        galleries: []
      });
      console.log(`✓ ${p.title}`);
    }

    const total = await Photo.countDocuments();
    console.log(`\n✅ Success! Total photos: ${total}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addPhotos();
