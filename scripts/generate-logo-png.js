const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create the logo PNG
const size = 256; // Create a reasonably large PNG
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Fill background with a gradient
const gradient = ctx.createLinearGradient(0, 0, size, size);
gradient.addColorStop(0, '#e50914');  // Netflix red
gradient.addColorStop(1, '#831010');  // Darker red
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, size, size);

// Add rounded corners (by creating a clipping path)
ctx.beginPath();
const radius = size * 0.1; // 10% of size for rounded corners
ctx.moveTo(radius, 0);
ctx.lineTo(size - radius, 0);
ctx.quadraticCurveTo(size, 0, size, radius);
ctx.lineTo(size, size - radius);
ctx.quadraticCurveTo(size, size, size - radius, size);
ctx.lineTo(radius, size);
ctx.quadraticCurveTo(0, size, 0, size - radius);
ctx.lineTo(0, radius);
ctx.quadraticCurveTo(0, 0, radius, 0);
ctx.closePath();
ctx.clip();

// Redraw the background with the clipping path applied
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, size, size);

// Add text
const fontSize = Math.floor(size / 4);
ctx.font = `bold ${fontSize}px Arial`;
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('TV.io', size / 2, size / 2);

// Save the PNG
const buffer = canvas.toBuffer('image/png');
const outputPath = path.join(__dirname, '../public/logo.png');
fs.writeFileSync(outputPath, buffer);

console.log(`Created logo.png at ${outputPath}`); 