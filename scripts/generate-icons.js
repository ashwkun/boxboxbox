const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Define the icon sizes required by the manifest
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate an icon for each size
sizes.forEach(size => {
  // Create a canvas with the required dimensions
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fill background with a gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#e50914');  // Netflix red
  gradient.addColorStop(1, '#831010');  // Darker red
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Add text
  const fontSize = Math.floor(size / 3);
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TV.io', size / 2, size / 2);

  // Save the icon
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), buffer);
  
  console.log(`Created icon-${size}x${size}.png`);
});

console.log('All icons generated successfully!'); 