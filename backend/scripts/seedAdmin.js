require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { connectDatabase } = require('../database/connection');
const AdminUser = require('../models/AdminUser');

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Please set it in your .env and ensure MongoDB is running.');
    process.exit(1);
  }
  await connectDatabase();
  const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@blizzbeautified.com';
  let defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || null;

  const existing = await AdminUser.findOne({ email: defaultEmail });
if (existing) {
    existing.password = defaultPassword;
    await existing.save();
    console.log('Admin password updated for:', defaultEmail);
    process.exit(0);
  }

  if (!defaultPassword) {
    defaultPassword = crypto.randomBytes(10).toString('base64');
  }

  await AdminUser.create({ name: 'Administrator', email: defaultEmail, password: defaultPassword, role: 'admin', isActive: true });

  const logsDir = path.join(__dirname, '..', 'logs');
  try { fs.mkdirSync(logsDir, { recursive: true }); } catch (e) {}
  const credPath = path.join(logsDir, 'admin-credentials.txt');
  fs.writeFileSync(credPath, `Admin account created: ${new Date().toISOString()}\nLogin URL: http://localhost:${process.env.PORT || 5000}/admin/login (POST)\nEmail: ${defaultEmail}\nPassword: ${defaultPassword}\n`);

  console.log('Admin seeded. Credentials saved to', credPath);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
