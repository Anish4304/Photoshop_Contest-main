import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Photographer from '../models/Photographer';
import Judge from '../models/Judge';
import Category from '../models/Category';
import Photo from '../models/Photo';
import Gallery from '../models/Gallery';
import JudgeScore from '../models/JudgeScore';
import Visitor from '../models/Visitor';
import VisitorVote from '../models/VisitorVote';
import Winner from '../models/Winner';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to DB
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/photography_contest'
    );

    console.log('Connected to MongoDB...');

    // Clear existing data
    await Photographer.deleteMany({});
    await Judge.deleteMany({});
    await Category.deleteMany({});
    await Photo.deleteMany({});
    await Gallery.deleteMany({});
    await JudgeScore.deleteMany({});
    await Visitor.deleteMany({});
    await VisitorVote.deleteMany({});
    await Winner.deleteMany({});

    console.log('Cleared existing data...');

    // Hash password for all users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Categories
    const categories = await Category.insertMany([
      { name: 'Nature', description: 'Beautiful landscapes and nature photography' },
      { name: 'Portrait', description: 'Capturing human emotions and expressions' },
      { name: 'Wildlife', description: 'Animals in their natural habitat' },
      { name: 'Street', description: 'Candid moments from urban life' },
    ]);

    console.log('Categories created...');

    // Create Photographers
    const photographers = await Photographer.insertMany([
      {
        name: 'John Doe',
        email: 'john@photographer.com',
        password: hashedPassword,
        phone: '+1234567890',
        bio: 'Professional nature photographer with 10 years experience',
      },
      {
        name: 'Jane Smith',
        email: 'jane@photographer.com',
        password: hashedPassword,
        phone: '+1234567891',
        bio: 'Portrait specialist and wedding photographer',
      },
      {
        name: 'Mike Johnson',
        email: 'mike@photographer.com',
        password: hashedPassword,
        phone: '+1234567892',
        bio: 'Wildlife photographer and conservationist',
      },
      {
        name: 'Sarah Williams',
        email: 'sarah@photographer.com',
        password: hashedPassword,
        phone: '+1234567893',
        bio: 'Street photographer documenting urban culture',
      },
      {
        name: 'David Brown',
        email: 'david@photographer.com',
        password: hashedPassword,
        phone: '+1234567894',
        bio: 'Multi-genre photographer',
      },
    ]);

    console.log('Photographers created...');

    // Create Judges
    const judges = await Judge.insertMany([
      {
        name: 'Emily Davis',
        email: 'emily@judge.com',
        password: hashedPassword,
        expertise: 'Landscape and Nature Photography',
      },
      {
        name: 'Robert Wilson',
        email: 'robert@judge.com',
        password: hashedPassword,
        expertise: 'Portrait and Fashion Photography',
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa@judge.com',
        password: hashedPassword,
        expertise: 'Wildlife and Documentary Photography',
      },
    ]);

    console.log('Judges created...');

    // Create Photos
    const photos = await Photo.insertMany([
      // John Doe - Nature
      {
        title: 'Sunset over Mountains',
        description: 'A breathtaking sunset view',
        imageUrl: '/uploads/sample1.jpg',
        photographerId: photographers[0]._id,
        categoryId: categories[0]._id,
      },
      {
        title: 'Forest Stream',
        description: 'A peaceful stream flowing through the forest',
        imageUrl: '/uploads/sample2.jpg',
        photographerId: photographers[0]._id,
        categoryId: categories[0]._id,
      },
      // Jane Smith - Portrait
      {
        title: 'The Smile',
        description: 'Capturing genuine happiness',
        imageUrl: '/uploads/sample3.jpg',
        photographerId: photographers[1]._id,
        categoryId: categories[1]._id,
      },
      {
        title: 'Contemplation',
        description: 'A moment of deep thought',
        imageUrl: '/uploads/sample4.jpg',
        photographerId: photographers[1]._id,
        categoryId: categories[1]._id,
      },
      // Mike Johnson - Wildlife
      {
        title: 'Lion Pride',
        description: 'A majestic lion family',
        imageUrl: '/uploads/sample5.jpg',
        photographerId: photographers[2]._id,
        categoryId: categories[2]._id,
      },
      {
        title: 'Eagle in Flight',
        description: 'An eagle soaring through the sky',
        imageUrl: '/uploads/sample6.jpg',
        photographerId: photographers[2]._id,
        categoryId: categories[2]._id,
      },
      // Sarah Williams - Street
      {
        title: 'Urban Rush',
        description: 'City life in motion',
        imageUrl: '/uploads/sample7.jpg',
        photographerId: photographers[3]._id,
        categoryId: categories[3]._id,
      },
      {
        title: 'Street Vendor',
        description: 'A hardworking street vendor',
        imageUrl: '/uploads/sample8.jpg',
        photographerId: photographers[3]._id,
        categoryId: categories[3]._id,
      },
      // David Brown - Multiple categories
      {
        title: 'Mountain Lake',
        description: 'A serene mountain lake',
        imageUrl: '/uploads/sample9.jpg',
        photographerId: photographers[4]._id,
        categoryId: categories[0]._id,
      },
      {
        title: 'City Portrait',
        description: 'Portrait in urban setting',
        imageUrl: '/uploads/sample10.jpg',
        photographerId: photographers[4]._id,
        categoryId: categories[1]._id,
      },
      {
        title: 'Bird Close-up',
        description: 'Beautiful bird photography',
        imageUrl: '/uploads/sample11.jpg',
        photographerId: photographers[4]._id,
        categoryId: categories[2]._id,
      },
    ]);

    console.log('Photos created...');

    // Create Galleries
    const galleries = await Gallery.insertMany([
      {
        name: 'Best of Nature',
        description: 'Top nature photographs',
        photos: [photos[0]._id, photos[1]._id, photos[8]._id],
      },
      {
        name: 'Portrait Masters',
        description: 'Exceptional portrait photography',
        photos: [photos[2]._id, photos[3]._id, photos[9]._id],
      },
      {
        name: "Editor's Choice",
        description: 'Staff picks from all categories',
        photos: [photos[0]._id, photos[2]._id, photos[4]._id, photos[6]._id],
      },
    ]);

    // Update photos with gallery references
    await Photo.findByIdAndUpdate(photos[0]._id, {
      $push: { galleries: { $each: [galleries[0]._id, galleries[2]._id] } },
    });
    await Photo.findByIdAndUpdate(photos[1]._id, {
      $push: { galleries: galleries[0]._id },
    });
    await Photo.findByIdAndUpdate(photos[2]._id, {
      $push: { galleries: { $each: [galleries[1]._id, galleries[2]._id] } },
    });
    await Photo.findByIdAndUpdate(photos[3]._id, {
      $push: { galleries: galleries[1]._id },
    });
    await Photo.findByIdAndUpdate(photos[4]._id, {
      $push: { galleries: galleries[2]._id },
    });
    await Photo.findByIdAndUpdate(photos[6]._id, {
      $push: { galleries: galleries[2]._id },
    });
    await Photo.findByIdAndUpdate(photos[8]._id, {
      $push: { galleries: galleries[0]._id },
    });
    await Photo.findByIdAndUpdate(photos[9]._id, {
      $push: { galleries: galleries[1]._id },
    });

    console.log('Galleries created...');

    // Create Judge Scores
    const judgeScores = [];
    for (let i = 0; i < photos.length; i++) {
      for (let j = 0; j < judges.length; j++) {
        judgeScores.push({
          judgeId: judges[j]._id,
          photoId: photos[i]._id,
          score: Math.floor(Math.random() * 5) + 6, // Random score between 6-10
          comment: 'Excellent work with great composition',
        });
      }
    }

    await JudgeScore.insertMany(judgeScores);

    console.log('Judge scores created...');

    // Create Visitors
    const visitors = await Visitor.insertMany([
      { name: 'Alice Cooper', email: 'alice@visitor.com' },
      { name: 'Bob Martin', email: 'bob@visitor.com' },
      { name: 'Carol Lee', email: 'carol@visitor.com' },
      { name: 'Dan Thompson', email: 'dan@visitor.com' },
      { name: 'Eve Garcia', email: 'eve@visitor.com' },
      { name: 'Frank White', email: 'frank@visitor.com' },
      { name: 'Grace Hall', email: 'grace@visitor.com' },
      { name: 'Henry King', email: 'henry@visitor.com' },
    ]);

    console.log('Visitors created...');

    // Create Visitor Votes
    const visitorVotes = [];
    for (let i = 0; i < visitors.length; i++) {
      // Each visitor votes for 5-15 random photos
      const voteCount = Math.floor(Math.random() * 11) + 5;
      const votedPhotos = new Set();

      for (let j = 0; j < voteCount; j++) {
        const randomPhotoIndex = Math.floor(Math.random() * photos.length);
        if (!votedPhotos.has(randomPhotoIndex)) {
          votedPhotos.add(randomPhotoIndex);
          visitorVotes.push({
            visitorId: visitors[i]._id,
            photoId: photos[randomPhotoIndex]._id,
          });
        }
      }
    }

    await VisitorVote.insertMany(visitorVotes);

    console.log('Visitor votes created...');

    // Calculate scores and create winners
    const winnersData = [];

    for (const category of categories) {
      // Get all photos in this category with their scores
      const categoryPhotos = await Photo.find({ categoryId: category._id });

      const photoScores = await Promise.all(
        categoryPhotos.map(async (photo) => {
          const judgeScores = await JudgeScore.find({ photoId: photo._id });
          const totalJudgeScore = judgeScores.reduce(
            (sum, score) => sum + score.score,
            0
          );

          const visitorVoteCount = await VisitorVote.countDocuments({
            photoId: photo._id,
          });

          return {
            photoId: photo._id,
            totalScore: totalJudgeScore + visitorVoteCount,
          };
        })
      );

      // Sort by score and create winners
      photoScores.sort((a, b) => b.totalScore - a.totalScore);

      for (let i = 0; i < Math.min(3, photoScores.length); i++) {
        winnersData.push({
          photoId: photoScores[i].photoId,
          categoryId: category._id,
          position: i + 1,
          totalScore: photoScores[i].totalScore,
          announcement: `Congratulations! Winner of position ${i + 1} in ${category.name} category`,
        });
      }
    }

    await Winner.insertMany(winnersData);

    console.log('Winners declared...');

    console.log('✅ Seed data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${categories.length} categories`);
    console.log(`- ${photographers.length} photographers`);
    console.log(`- ${judges.length} judges`);
    console.log(`- ${photos.length} photos`);
    console.log(`- ${galleries.length} galleries`);
    console.log(`- ${judgeScores.length} judge scores`);
    console.log(`- ${visitors.length} visitors`);
    console.log(`- ${visitorVotes.length} visitor votes`);
    console.log(`- ${winnersData.length} winners`);

    console.log('\n🔐 Login Credentials:');
    console.log('Admin: admin@contest.com / admin123');
    console.log('Photographer: john@photographer.com / password123');
    console.log('Judge: emily@judge.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
