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

const seedAtlasData = async () => {
  try {
    // Connect to MongoDB Atlas
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas...');

    // Clear existing data
    await Promise.all([
      Photographer.deleteMany({}),
      Judge.deleteMany({}),
      Category.deleteMany({}),
      Photo.deleteMany({}),
      Gallery.deleteMany({}),
      JudgeScore.deleteMany({}),
      Visitor.deleteMany({}),
      VisitorVote.deleteMany({}),
      Winner.deleteMany({})
    ]);

    console.log('🧹 Cleared existing data...');

    // Hash password for all users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Categories (matching frontend sample data)
    const categories = await Category.insertMany([
      { name: 'Nature', description: 'Beautiful landscapes and nature photography' },
      { name: 'Portrait', description: 'Capturing human emotions and expressions' },
      { name: 'Wildlife', description: 'Animals in their natural habitat' },
      { name: 'Street', description: 'Candid moments from urban life' },
    ]);

    console.log('📂 Categories created...');

    // Create Photographers (matching frontend sample data)
    const photographers = await Photographer.insertMany([
      {
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        password: hashedPassword,
        phone: '+1234567890',
        bio: 'Professional nature photographer with 10 years experience',
      },
      {
        name: 'Marcus Johnson',
        email: 'marcus@example.com',
        password: hashedPassword,
        phone: '+1234567891',
        bio: 'Portrait specialist and wedding photographer',
      },
      {
        name: 'Emma Rodriguez',
        email: 'emma@example.com',
        password: hashedPassword,
        phone: '+1234567892',
        bio: 'Wildlife photographer and conservationist',
      },
      {
        name: 'Alex Kim',
        email: 'alex@example.com',
        password: hashedPassword,
        phone: '+1234567893',
        bio: 'Street photographer documenting urban culture',
      },
    ]);

    console.log('👥 Photographers created...');

    // Create Judges
    const judges = await Judge.insertMany([
      {
        name: 'Judge Anderson',
        email: 'judge@example.com',
        password: hashedPassword,
        expertise: 'Professional Photography Judge with 15 years experience',
      },
      {
        name: 'Emily Davis',
        email: 'emily@judge.com',
        password: hashedPassword,
        expertise: 'Landscape and Nature Photography Expert',
      },
      {
        name: 'Robert Wilson',
        email: 'robert@judge.com',
        password: hashedPassword,
        expertise: 'Portrait and Fashion Photography Specialist',
      },
    ]);

    console.log('⚖️ Judges created...');

    // Create Photos (matching frontend sample data with high-quality images)
    const photos = await Photo.insertMany([
      // Sarah Chen - Nature
      {
        title: 'Mountain Sunrise',
        description: 'A breathtaking sunrise over the mountains',
        imageUrl: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800',
        photographerId: photographers[0]._id,
        categoryId: categories[0]._id,
      },
      {
        title: 'Forest Mist',
        description: 'Morning fog rolling through pine forest',
        imageUrl: 'https://images.pexels.com/photos/1574438/pexels-photo-1574438.jpeg?auto=compress&cs=tinysrgb&w=800',
        photographerId: photographers[0]._id,
        categoryId: categories[0]._id,
      },
      {
        title: 'Ocean Waves',
        description: 'Power of the sea captured at dawn',
        imageUrl: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
        photographerId: photographers[0]._id,
        categoryId: categories[0]._id,
      },
      // Marcus Johnson - Portrait
      {
        title: 'Urban Portrait',
        description: 'City life captured in a moment',
        imageUrl: 'https://images.pexels.com/photos/1759531/pexels-photo-1759531.jpeg?auto=compress&cs=tinysrgb&w=800',
        photographerId: photographers[1]._id,
        categoryId: categories[1]._id,
      },
      {
        title: 'Golden Hour Portrait',
        description: 'Natural light portrait at sunset',
        imageUrl: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=800',
        photographerId: photographers[1]._id,
        categoryId: categories[1]._id,
      },
      {
        title: 'Elder Portrait',
        description: 'Wisdom captured in a face',
        imageUrl: 'https://images.pexels.com/photos/1759531/pexels-photo-1759531.jpeg?auto=compress&cs=tinysrgb&w=800',
        photographerId: photographers[1]._id,
        categoryId: categories[1]._id,
      },
      // Emma Rodriguez - Wildlife
      {
        title: 'Eagle in Flight',
        description: 'Majestic eagle soaring through the sky',
        imageUrl: 'https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=800',
        photographerId: photographers[2]._id,
        categoryId: categories[2]._id,
      },
      {
        title: 'Tiger Close-up',
        description: 'Intense gaze of a Bengal tiger',
        imageUrl: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=800',
        photographerId: photographers[2]._id,
        categoryId: categories[2]._id,
      },
      {
        title: 'Hummingbird Feeding',
        description: 'Frozen moment of nature\'s beauty',
        imageUrl: 'https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=800',
        photographerId: photographers[2]._id,
        categoryId: categories[2]._id,
      },
      // Alex Kim - Street
      {
        title: 'Rainy City Streets',
        description: 'Reflections on wet cobblestones',
        imageUrl: 'https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?auto=compress&cs=tinysrgb&w=800',
        photographerId: photographers[3]._id,
        categoryId: categories[3]._id,
      },
      {
        title: 'Street Vendor',
        description: 'Life in the bustling marketplace',
        imageUrl: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800',
        photographerId: photographers[3]._id,
        categoryId: categories[3]._id,
      },
      {
        title: 'Downtown Night',
        description: 'City lights and urban energy',
        imageUrl: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800',
        photographerId: photographers[3]._id,
        categoryId: categories[3]._id,
      },
    ]);

    console.log('📸 Photos created...');

    // Create Galleries
    const galleries = await Gallery.insertMany([
      {
        name: 'Best of Nature',
        description: 'Top nature photographs',
        photos: [photos[0]._id, photos[1]._id, photos[2]._id],
      },
      {
        name: 'Portrait Masters',
        description: 'Exceptional portrait photography',
        photos: [photos[3]._id, photos[4]._id, photos[5]._id],
      },
      {
        name: 'Wildlife Wonders',
        description: 'Amazing wildlife captures',
        photos: [photos[6]._id, photos[7]._id, photos[8]._id],
      },
      {
        name: 'Urban Stories',
        description: 'Street photography collection',
        photos: [photos[9]._id, photos[10]._id, photos[11]._id],
      },
    ]);

    console.log('🖼️ Galleries created...');

    // Create Judge Scores (matching frontend sample data scores)
    const judgeScores = [];
    const sampleScores = [95, 88, 92, 85, 90, 87, 94, 91, 89, 93, 86, 96];
    
    for (let i = 0; i < photos.length; i++) {
      for (let j = 0; j < judges.length; j++) {
        const baseScore = sampleScores[i] || 85;
        const variation = Math.floor(Math.random() * 10) - 5; // ±5 variation
        const score = Math.max(70, Math.min(100, baseScore + variation));
        
        judgeScores.push({
          judgeId: judges[j]._id,
          photoId: photos[i]._id,
          score: score,
          comment: `Excellent composition and technical execution. Score: ${score}/100`,
        });
      }
    }

    await JudgeScore.insertMany(judgeScores);
    console.log('⭐ Judge scores created...');

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
      { name: 'Ivy Chen', email: 'ivy@visitor.com' },
      { name: 'Jack Wilson', email: 'jack@visitor.com' },
    ]);

    console.log('👤 Visitors created...');

    // Create Visitor Votes (matching frontend sample data vote counts)
    const sampleVoteCounts = [234, 189, 312, 156, 267, 198, 401, 278, 223, 345, 167, 412];
    const visitorVotes = [];

    for (let i = 0; i < photos.length; i++) {
      const targetVotes = sampleVoteCounts[i] || 200;
      const actualVotes = Math.min(targetVotes, visitors.length * 5); // Max 5 votes per visitor per photo
      
      for (let v = 0; v < actualVotes; v++) {
        const visitorIndex = v % visitors.length;
        visitorVotes.push({
          visitorId: visitors[visitorIndex]._id,
          photoId: photos[i]._id,
        });
      }
    }

    await VisitorVote.insertMany(visitorVotes);
    console.log('🗳️ Visitor votes created...');

    // Calculate winners for each category
    const winnersData = [];

    for (const category of categories) {
      const categoryPhotos = await Photo.find({ categoryId: category._id });
      
      const photoScores = await Promise.all(
        categoryPhotos.map(async (photo) => {
          const judgeScoresForPhoto = await JudgeScore.find({ photoId: photo._id });
          const avgJudgeScore = judgeScoresForPhoto.reduce((sum, score) => sum + score.score, 0) / judgeScoresForPhoto.length;
          
          const visitorVoteCount = await VisitorVote.countDocuments({ photoId: photo._id });
          
          // Combined score: 70% judge score + 30% visitor votes (normalized)
          const normalizedVotes = Math.min(visitorVoteCount / 10, 30); // Max 30 points from votes
          const totalScore = (avgJudgeScore * 0.7) + (normalizedVotes * 0.3);
          
          return {
            photoId: photo._id,
            totalScore: totalScore,
            judgeScore: avgJudgeScore,
            visitorVotes: visitorVoteCount,
          };
        })
      );

      // Sort by total score and create winners
      photoScores.sort((a, b) => b.totalScore - a.totalScore);

      for (let i = 0; i < Math.min(3, photoScores.length); i++) {
        winnersData.push({
          photoId: photoScores[i].photoId,
          categoryId: category._id,
          position: i + 1,
          totalScore: Math.round(photoScores[i].totalScore),
          announcement: `🏆 Winner of position ${i + 1} in ${category.name} category with ${Math.round(photoScores[i].totalScore)} points!`,
        });
      }
    }

    await Winner.insertMany(winnersData);
    console.log('🏆 Winners declared...');

    // Create Admin user
    const adminUser = await Photographer.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      phone: '+1234567999',
      bio: 'System Administrator',
      role: 'admin',
    });

    console.log('👑 Admin user created...');

    console.log('\n🎉 Atlas seed data created successfully!');
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
    console.log('Admin: admin@example.com / password123');
    console.log('Photographer: sarah@example.com / password123');
    console.log('Judge: judge@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Atlas data:', error);
    process.exit(1);
  }
};

seedAtlasData();