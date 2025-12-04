const fs = require('fs');
const path = require('path');

// Simple 1x1 PNG placeholder (smallest valid PNG)
// This is a valid PNG file created programmatically
const createPlaceholderPNG = (filename) => {
  // PNG signature + minimal IHDR chunk + IDAT chunk + IEND chunk
  const png = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk size
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width: 1
    0x00, 0x00, 0x00, 0x01, // height: 1
    0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
    0x90, 0x77, 0x53, 0xDE, // CRC
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk size
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0xFE, 0xFF,
    0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x4B, 0xB6,
    0xEE, 0x56,
    0x00, 0x00, 0x00, 0x00, // IEND chunk size
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  const filepath = path.join(__dirname, 'uploads', filename);
  fs.writeFileSync(filepath, png);
  console.log(`✅ Created: ${filename}`);
};

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create sample images
const sampleImages = ['sample1.jpg', 'sample2.jpg', 'sample3.jpg', 'sample4.jpg', 'sample5.jpg'];
sampleImages.forEach(img => createPlaceholderPNG(img));

console.log('\n✅ All sample images created in uploads/ folder');
