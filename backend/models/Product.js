const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, default: 0 },
  category: { type: String, default: 'General', trim: true },
  images: [{ type: String }],
  currency: { type: String, default: 'NGN' },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  sale: { type: Boolean, default: false },
  outOfStock: { type: Boolean, default: false },
  inventory: { type: Number, default: 0 },
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
