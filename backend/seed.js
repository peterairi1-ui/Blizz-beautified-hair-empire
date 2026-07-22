require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const Product = require('./models/Product');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const wigsToSeed = [
  { file: 'braided-wig-01.jpeg', name: 'Braided Wig 01', price: 1200, featured: true, bestSeller: true, newArrival: true, description: 'Elegant braided wig crafted for a polished finish and comfortable wear.' },
  { file: 'braided-wig-02.jpeg', name: 'Braided Wig 02', price: 1350, featured: true, bestSeller: false, newArrival: true, description: 'Soft texture and natural movement for everyday luxury.' },
  { file: 'braided-wig-03.jpeg', name: 'Braided Wig 03', price: 1450, featured: true, bestSeller: true, newArrival: false, description: 'A refined braided style created with volume and balance in mind.' },
  { file: 'braided-wig-04.jpeg', name: 'Braided Wig 04', price: 1280, featured: true, bestSeller: false, newArrival: false, description: 'Lightweight and graceful for a soft, feminine statement.' },
  { file: 'braided-wig-05.jpeg', name: 'Braided Wig 05', price: 1500, featured: true, bestSeller: true, newArrival: true, description: 'Full-bodied design with a luxurious finish and natural appearance.' },
  { file: 'braided-wig-06.jpeg', name: 'Braided Wig 06', price: 1380, featured: false, bestSeller: false, newArrival: true, description: 'A chic braided texture designed to elevate any look.' },
  { file: 'braided-wig-07.jpeg', name: 'Braided Wig 07', price: 1420, featured: false, bestSeller: true, newArrival: false, description: 'Sculpted braids that feel premium, comfortable and versatile.' },
  { file: 'braided-wig-08.jpeg', name: 'Braided Wig 08', price: 1320, featured: false, bestSeller: false, newArrival: true, description: 'Luxury texture and a flattering silhouette for daily glamour.' },
  { file: 'braided-wig-09.jpeg', name: 'Braided Wig 09', price: 1490, featured: true, bestSeller: true, newArrival: false, description: 'Beautifully finished braids with a graceful, premium feel.' },
  { file: 'braided-wig-10.jpeg', name: 'Braided Wig 10', price: 1360, featured: false, bestSeller: false, newArrival: true, description: 'A statement piece that brings elegance and movement together.' },
  { file: 'braided-wig-11.jpeg', name: 'Braided Wig 11', price: 1410, featured: false, bestSeller: true, newArrival: false, description: 'Balanced styling and premium craftsmanship from every angle.' },
  { file: 'braided-wig-12.jpeg', name: 'Braided Wig 12', price: 1340, featured: true, bestSeller: false, newArrival: true, description: 'A versatile braided look designed for sophisticated styling.' },
  { file: 'braided-wig-13.jpeg', name: 'Braided Wig 13', price: 1520, featured: false, bestSeller: true, newArrival: false, description: 'Premium finish with a rich texture and elegant presence.' },
  { file: 'braided-wig-14.jpeg', name: 'Braided Wig 14', price: 1390, featured: true, bestSeller: false, newArrival: true, description: 'The perfect blend of softness, volume and modern structure.' },
  { file: 'braided-wig-15.jpeg', name: 'Braided Wig 15', price: 1460, featured: false, bestSeller: true, newArrival: false, description: 'Crafted for a full, luxe finish that feels effortlessly chic.' },
  { file: 'braided-wig-16.jpeg', name: 'Braided Wig 16', price: 1370, featured: true, bestSeller: false, newArrival: true, description: 'Elegant and timeless, with a soft structure that flatters every face.' },
  { file: 'braided-wig-17.jpeg', name: 'Braided Wig 17', price: 1480, featured: false, bestSeller: true, newArrival: false, description: 'A luxurious braided look designed to feel bold and beautiful.' },
];

const IMAGE_DIR = path.join(__dirname, '..', 'frontend', 'src', 'assets', 'images', 'products', 'braided-wigs');

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Run with the Atlas connection string, e.g.\n  $env:MONGODB_URI="mongodb+srv://...";  node seed.js');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB:', mongoose.connection.name);

  let created = 0;
  let skipped = 0;

  for (const wig of wigsToSeed) {
    const slug = slugify(wig.name);

    const existing = await Product.findOne({ slug });
    if (existing) {
      console.log(`Skipping "${wig.name}" — already exists.`);
      skipped += 1;
      continue;
    }

    const imagePath = path.join(IMAGE_DIR, wig.file);

    console.log(`Uploading ${wig.file} to Cloudinary...`);
    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(imagePath, { folder: 'blizz-beautified' });
    } catch (err) {
      console.error(`Failed to upload ${wig.file}:`, err.message);
      continue;
    }

    const product = await Product.create({
      name: wig.name,
      slug,
      description: wig.description,
      price: wig.price,
      category: 'Braided Wigs',
      images: [uploadResult.secure_url],
      currency: 'NGN',
      isActive: true,
      featured: wig.featured,
      bestSeller: wig.bestSeller,
      newArrival: wig.newArrival,
      tags: ['braided', 'wig'],
    });

    console.log(`Created "${product.name}" (${product.slug})`);
    created += 1;
  }

  console.log(`\nDone. Created ${created}, skipped ${skipped}.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});