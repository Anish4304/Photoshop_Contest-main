const fs = require('fs');
const path = require('path');

// Create simple colored rectangles as sample images
const createSampleImage = (filename, color) => {
  // Simple 1x1 pixel PNG in base64
  const images = {
    red: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
    green: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIApD5fRAAAAABJRU5ErkJggg==',
    blue: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==',
    yellow: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    purple: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwnwAFBQIAX8jx0gAAAABJRU5ErkJggg=='
  };
  
  const buffer = Buffer.from(images[color] || images.red, 'base64');
  const filepath = path.join(__dirname, 'uploads', filename);
  fs.writeFileSync(filepath, buffer);
  console.log(`Created ${filename}`);
};

// Create sample images
const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'red', 'green', 'blue', 'yellow', 'purple', 'red'];
for (let i = 1; i <= 11; i++) {
  createSampleImage(`sample${i}.jpg`, colors[i-1]);
}

console.log('All sample images created!');
