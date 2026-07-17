require('dotenv').config();
const mongoose = require('mongoose');
const { connectDatabase } = require('../database/connection');
const Product = require('../models/Product');

async function listBraidedImages() {
  const ok = await connectDatabase();
  if (!ok) {
    console.warn('Warning: could not connect to MongoDB.');
  }

  try {
    const prods = await Product.find({ $or: [ { slug: /braid/i }, { images: { $elemMatch: { $regex: 'braided-wigs' } } }, { category: /Braided/i } ] }).lean();
    if (!prods || prods.length === 0) {
      console.log('No braided-wig products found in database.');
    } else {
      console.log(JSON.stringify(prods.map(p => ({ _id: p._id, name: p.name, slug: p.slug, images: p.images })), null, 2));
    }
  } catch (err) {
    console.error('Query failed:', err.message);
  } finally {
    try { await mongoose.connection.close(); } catch (e) {}
    process.exit(0);
  }
}

listBraidedImages();
