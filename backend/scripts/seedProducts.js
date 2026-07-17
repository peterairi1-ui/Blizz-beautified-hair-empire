require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { connectDatabase } = require('../database/connection');
const Product = require('../models/Product');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const SOURCE_DIR = path.join(__dirname, '..', '..', 'frontend', 'public', 'uploads', 'braided-wigs');
const TARGET_DIR = path.join(__dirname, '..', 'uploads', 'braided-wigs');

const products = [
  {
    name: 'Elegant Box Braids',
    slug: 'elegant-box-braids',
    description: 'Elegant braided wig crafted for a polished finish and comfortable wear.',
    price: 120000,
    featured: true,
    bestSeller: true,
    newArrival: true,
    imageFile: 'braided-wig-01.jpeg',
    tags: ['box braids', 'natural', 'premium'],
  },
  {
    name: 'Soft Waist-length Braids',
    slug: 'soft-waist-length-braids',
    description: 'Soft texture and natural movement for everyday luxury.',
    price: 135000,
    featured: true,
    bestSeller: false,
    newArrival: true,
    imageFile: 'braided-wig-02.jpeg',
    tags: ['waist length', 'soft', 'comfortable'],
  },
  {
    name: 'Refined Luxury Braids',
    slug: 'refined-luxury-braids',
    description: 'A refined braided style created with volume and balance in mind.',
    price: 145000,
    featured: true,
    bestSeller: true,
    newArrival: false,
    imageFile: 'braided-wig-03.jpeg',
    tags: ['luxury', 'volume', 'balanced'],
  },
  {
    name: 'Lightweight Braided Elegance',
    slug: 'lightweight-braided-elegance',
    description: 'Lightweight and graceful for a soft, feminine statement.',
    price: 128000,
    featured: true,
    bestSeller: false,
    newArrival: false,
    imageFile: 'braided-wig-04.jpeg',
    tags: ['lightweight', 'elegant', 'daily wear'],
  },
  {
    name: 'Full-Body Signature Braids',
    slug: 'full-body-signature-braids',
    description: 'Full-bodied design with a luxurious finish and natural appearance.',
    price: 150000,
    featured: true,
    bestSeller: true,
    newArrival: true,
    imageFile: 'braided-wig-05.jpeg',
    tags: ['full body', 'natural', 'signature'],
  },
  {
    name: 'Chic Braided Texture',
    slug: 'chic-braided-texture',
    description: 'A chic braided texture designed to elevate any look.',
    price: 138000,
    featured: false,
    bestSeller: false,
    newArrival: true,
    imageFile: 'braided-wig-06.jpeg',
    tags: ['chic', 'texture', 'stylish'],
  },
  {
    name: 'Premium Sculpted Braids',
    slug: 'premium-sculpted-braids',
    description: 'Sculpted braids that feel premium, comfortable and versatile.',
    price: 142000,
    featured: false,
    bestSeller: true,
    newArrival: false,
    imageFile: 'braided-wig-07.jpeg',
    tags: ['sculpted', 'premium', 'versatile'],
  },
  {
    name: 'Flattering Glam Braids',
    slug: 'flattering-glam-braids',
    description: 'Luxury texture and a flattering silhouette for daily glamour.',
    price: 132000,
    featured: false,
    bestSeller: false,
    newArrival: true,
    imageFile: 'braided-wig-08.jpeg',
    tags: ['glam', 'flattering', 'luxury'],
  },
  {
    name: 'Graceful Premium Braids',
    slug: 'graceful-premium-braids',
    description: 'Beautifully finished braids with a graceful, premium feel.',
    price: 149000,
    featured: true,
    bestSeller: true,
    newArrival: false,
    imageFile: 'braided-wig-09.jpeg',
    tags: ['graceful', 'premium', 'finished'],
  },
  {
    name: 'Statement Braided Style',
    slug: 'statement-braided-style',
    description: 'A statement piece that brings elegance and movement together.',
    price: 136000,
    featured: false,
    bestSeller: false,
    newArrival: true,
    imageFile: 'braided-wig-10.jpeg',
    tags: ['statement', 'movement', 'elegance'],
  },
  {
    name: 'Balanced Braided Beauty',
    slug: 'balanced-braided-beauty',
    description: 'Balanced styling and premium craftsmanship from every angle.',
    price: 141000,
    featured: false,
    bestSeller: true,
    newArrival: false,
    imageFile: 'braided-wig-11.jpeg',
    tags: ['balanced', 'craftsmanship', 'beauty'],
  },
  {
    name: 'Versatile Braided Look',
    slug: 'versatile-braided-look',
    description: 'A versatile braided look designed for sophisticated styling.',
    price: 134000,
    featured: true,
    bestSeller: false,
    newArrival: true,
    imageFile: 'braided-wig-12.jpeg',
    tags: ['versatile', 'sophisticated', 'stylish'],
  },
  {
    name: 'Rich Texture Braids',
    slug: 'rich-texture-braids',
    description: 'Premium finish with a rich texture and elegant presence.',
    price: 152000,
    featured: false,
    bestSeller: true,
    newArrival: false,
    imageFile: 'braided-wig-13.jpeg',
    tags: ['rich texture', 'elegant', 'premium'],
  },
  {
    name: 'Soft Volume Braids',
    slug: 'soft-volume-braids',
    description: 'The perfect blend of softness, volume and modern structure.',
    price: 139000,
    featured: true,
    bestSeller: false,
    newArrival: true,
    imageFile: 'braided-wig-14.jpeg',
    tags: ['soft', 'volume', 'modern'],
  },
  {
    name: 'Luxe Finish Braids',
    slug: 'luxe-finish-braids',
    description: 'Crafted for a full, luxe finish that feels effortlessly chic.',
    price: 146000,
    featured: false,
    bestSeller: true,
    newArrival: false,
    imageFile: 'braided-wig-15.jpeg',
    tags: ['luxe', 'chic', 'full finish'],
  },
  {
    name: 'Timeless Braided Elegance',
    slug: 'timeless-braided-elegance',
    description: 'Elegant and timeless, with a soft structure that flatters every face.',
    price: 137000,
    featured: true,
    bestSeller: false,
    newArrival: true,
    imageFile: 'braided-wig-16.jpeg',
    tags: ['timeless', 'elegant', 'soft'],
  },
  {
    name: 'Bold Braided Statement',
    slug: 'bold-braided-statement',
    description: 'A luxurious braided look designed to feel bold and beautiful.',
    price: 148000,
    featured: false,
    bestSeller: true,
    newArrival: false,
    imageFile: 'braided-wig-17.jpeg',
    tags: ['bold', 'beautiful', 'luxury'],
  },
];

async function seedProducts() {
  await connectDatabase();

  fs.mkdirSync(TARGET_DIR, { recursive: true });

  for (const product of products) {
    const sourceImage = path.join(SOURCE_DIR, product.imageFile);
    const targetImage = path.join(TARGET_DIR, product.imageFile);
    if (!fs.existsSync(sourceImage)) {
      console.error(`Missing source image: ${sourceImage}`);
      continue;
    }

    fs.copyFileSync(sourceImage, targetImage);
    const imageUrl = `/uploads/braided-wigs/${product.imageFile}`;

    const payload = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      images: [imageUrl],
      currency: 'NGN',
      isActive: true,
      featured: product.featured,
      bestSeller: product.bestSeller,
      newArrival: product.newArrival,
      sale: false,
      outOfStock: false,
      inventory: 100,
      tags: product.tags,
    };

    await Product.updateOne(
      { slug: product.slug },
      { $set: payload },
      { upsert: true },
    );

    console.log(`Seeded product: ${product.name}`);
  }

  console.log('Braided wig product seeding complete.');
  process.exit(0);
}

seedProducts().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
