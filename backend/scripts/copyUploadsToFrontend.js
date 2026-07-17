const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'uploads', 'braided-wigs');
const destDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'uploads', 'braided-wigs');

try {
  fs.mkdirSync(destDir, { recursive: true });
  const files = fs.readdirSync(srcDir);
  files.forEach((file) => {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    try {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file}`);
    } catch (e) {
      console.error(`Failed to copy ${file}: ${e.message}`);
    }
  });
  console.log('Done copying uploads to frontend public folder.');
} catch (err) {
  console.error('Error during copy:', err.message);
  process.exit(1);
}
