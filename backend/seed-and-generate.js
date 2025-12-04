const { execSync } = require('child_process');

console.log('Step 1: Seeding database...');
execSync('npm run seed', { stdio: 'inherit', cwd: __dirname });

console.log('\nStep 2: Waiting 2 seconds...');
setTimeout(() => {
  console.log('\nStep 3: Generating images...');
  execSync('node generate-realistic-images.js', { stdio: 'inherit', cwd: __dirname });
}, 2000);
