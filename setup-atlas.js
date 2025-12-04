const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Photography Contest with MongoDB Atlas...\n');

// Step 1: Check if Atlas connection string is provided
const envPath = path.join(__dirname, 'backend', '.env');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.log('📝 Creating .env file...');
  fs.copyFileSync(path.join(__dirname, 'backend', '.env.atlas'), envPath);
  envContent = fs.readFileSync(envPath, 'utf8');
}

if (envContent.includes('<username>') || envContent.includes('<password>')) {
  console.log('⚠️  MongoDB Atlas connection string not configured!');
  console.log('\n📋 Please follow these steps:');
  console.log('1. Go to https://cloud.mongodb.com/');
  console.log('2. Create account or login');
  console.log('3. Create new cluster (free tier available)');
  console.log('4. Go to Database Access -> Add Database User');
  console.log('5. Go to Network Access -> Add IP Address (0.0.0.0/0 for all IPs)');
  console.log('6. Go to Clusters -> Connect -> Connect your application');
  console.log('7. Copy connection string and update backend/.env file');
  console.log('\n📁 Edit backend/.env and replace MONGODB_URI with your Atlas connection string');
  console.log('Then run this script again: node setup-atlas.js');
  process.exit(1);
}

console.log('✅ MongoDB Atlas connection string found');

// Step 2: Install dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install', { cwd: __dirname, stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Step 3: Build and seed database
console.log('\n🔨 Building backend...');
try {
  execSync('npm run build', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to build backend');
  process.exit(1);
}

console.log('\n🌱 Seeding Atlas database with sample data...');
try {
  execSync('npx ts-node src/scripts/seed-atlas.ts', { 
    cwd: path.join(__dirname, 'backend'), 
    stdio: 'inherit' 
  });
} catch (error) {
  console.error('❌ Failed to seed database');
  console.error('Make sure your MongoDB Atlas connection string is correct');
  process.exit(1);
}

// Step 4: Create start scripts
const startScript = `@echo off
echo 🚀 Starting Photography Contest Application...
echo.

echo 📡 Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo 🎨 Starting Frontend Application...
start "Frontend" cmd /k "npm run dev"

echo.
echo ✅ Application started!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:5000
echo.
echo 🔐 Demo Accounts:
echo Admin: admin@example.com / password123
echo Photographer: sarah@example.com / password123
echo Judge: judge@example.com / password123
echo.
pause`;

fs.writeFileSync(path.join(__dirname, 'start-atlas.bat'), startScript);

console.log('\n🎉 Setup complete!');
console.log('\n📋 What was created:');
console.log('✅ MongoDB Atlas database with sample data');
console.log('✅ 4 categories (Nature, Portrait, Wildlife, Street)');
console.log('✅ 4 photographers with 12 photos');
console.log('✅ 3 judges with scores');
console.log('✅ 10 visitors with votes');
console.log('✅ Winners calculated for each category');
console.log('✅ Admin user created');

console.log('\n🚀 To start the application:');
console.log('Run: start-atlas.bat');
console.log('Or manually:');
console.log('1. cd backend && npm run dev');
console.log('2. npm run dev (in another terminal)');

console.log('\n🔐 Demo Accounts:');
console.log('Admin: admin@example.com / password123');
console.log('Photographer: sarah@example.com / password123');
console.log('Judge: judge@example.com / password123');

console.log('\n🌐 URLs:');
console.log('Frontend: http://localhost:5173');
console.log('Backend: http://localhost:5000');