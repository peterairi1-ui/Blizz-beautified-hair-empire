require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blizz-beautified-hair-empire';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const products = await Product.find();
    for (const p of products) {
      let changed = false;
      if (Array.isArray(p.images) && p.images.length) {
        const newImages = p.images.map((img) => {
          if (!img) return img;
          return img.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, '');
        });
        if (JSON.stringify(newImages) !== JSON.stringify(p.images)) {
          p.images = newImages;
          changed = true;
        }
      }
      if (changed) {
        await p.save();
        console.log(`Updated images for product ${p._id}`);
      }
    }
    await mongoose.disconnect();
    console.log('Done normalizing product image paths.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
