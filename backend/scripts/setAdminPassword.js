require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const AdminUser = require('../models/AdminUser');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blizz-beautified-hair-empire';
const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@blizzbeautified.com';
const newPassword = process.argv[2] || process.env.DEFAULT_ADMIN_PASSWORD || 'blesin23232343';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const admin = await AdminUser.findOne({ email });
    if (admin) {
      admin.password = newPassword;
      await admin.save();
      console.log(`Updated password for ${email}`);
    } else {
      await AdminUser.create({ name: 'Administrator', email, password: newPassword, role: 'admin', isActive: true });
      console.log(`Created admin ${email}`);
    }

    try {
      const logsDir = path.join(__dirname, '..', 'logs');
      fs.mkdirSync(logsDir, { recursive: true });
      const credPath = path.join(logsDir, 'admin-credentials.txt');
      const content = [
        `Admin account updated: ${new Date().toISOString()}`,
        `Login URL: http://localhost:${process.env.PORT || 5000}/admin/login (POST)`,
        `Email: ${email}`,
        `Password: ${newPassword}`,
      ].join('\n');
      fs.writeFileSync(credPath, content);
      console.log(`Wrote credentials to ${credPath}`);
    } catch (e) {
      console.error('Failed to write credentials file:', e.message);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
