const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateIcons() {
  const sourceLogo = path.join(__dirname, '../public/logo.png');
  
  if (!await fileExists(sourceLogo)) {
    console.error('Source logo not found at:', sourceLogo);
    console.log('Please add a logo.png file to the public folder');
    return;
  }

  const sizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 96, name: 'favicon-96x96.png' },
    { size: 120, name: 'logo120.png' },
    { size: 144, name: 'logo144.png' },
    { size: 152, name: 'logo152.png' },
    { size: 167, name: 'logo167.png' },
    { size: 180, name: 'logo180.png' },
    { size: 192, name: 'logo192.png' },
    { size: 256, name: 'logo256.png' },
    { size: 384, name: 'logo384.png' },
    { size: 512, name: 'logo512.png' },
  ];

  console.log('Generating icons...');
  
  for (const { size, name } of sizes) {
    await sharp(sourceLogo)
      .resize(size, size, { fit: 'contain', background: { r: 25, g: 118, b: 210, alpha: 1 } })
      .toFile(path.join(__dirname, `../public/${name}`));
    console.log(`Generated: ${name}`);
  }

  // Generate maskable icon
  await sharp(sourceLogo)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(__dirname, '../public/logo-maskable.png'));
  console.log('Generated: logo-maskable.png');

  console.log('All icons generated successfully!');
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

generateIcons().catch(console.error);