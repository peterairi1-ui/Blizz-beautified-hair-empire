require('dotenv').config();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { connectDatabase } = require('./database/connection');
const AdminUser = require('./models/AdminUser');
const User = require('./models/User');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", CLIENT_URL, BACKEND_URL, 'data:'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      upgradeInsecureRequests: [],
    },
  },
}));
app.use(cors({ origin: process.env.CORS_ORIGIN || CLIENT_URL, credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 250 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many authentication attempts from this IP, please try again later.' });
app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/admin/login', authLimiter);
app.use('/admin/forgot', authLimiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Blizz Beautified Hair Empire API is running' });
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: /sitemap.xml');
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${process.env.CLIENT_URL || 'http://localhost:5173'}/</loc></url>\n  <url><loc>${process.env.CLIENT_URL || 'http://localhost:5173'}/shop</loc></url>\n  <url><loc>${process.env.CLIENT_URL || 'http://localhost:5173'}/about</loc></url>\n  <url><loc>${process.env.CLIENT_URL || 'http://localhost:5173'}/contact</loc></url>\n</urlset>`);
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin/auth', require('./routes/adminAuthRoutes'));
app.use('/admin', require('./routes/adminPublicRoutes'));
app.use('/admin/dashboard', require('./routes/adminDashboard'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));

app.use(notFoundHandler);
app.use(errorHandler);

async function bootstrap() {
  await connectDatabase();

  if (process.env.RUN_SEED_ON_BOOT === 'true') {
    try {
      const { run: runSeed } = require('./seed');
      const result = await runSeed();
      console.log(`Seed run complete: created ${result.created}, skipped ${result.skipped}`);
    } catch (err) {
      console.error('Seed run failed:', err.message);
    }
  }

  try {
    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@blizzbeautified.com';
    let defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || null;

    const existingAdmin = await AdminUser.findOne({ email: defaultEmail });
    if (!existingAdmin) {
      let tempPasswordCreated = false;
      if (!defaultPassword) {
        defaultPassword = crypto.randomBytes(10).toString('base64');
        tempPasswordCreated = true;
      }

      await AdminUser.create({
        name: 'Administrator',
        email: defaultEmail,
        password: defaultPassword,
        role: 'admin',
        isActive: true,
      });

      const logsDir = path.join(__dirname, 'logs');
      try {
        fs.mkdirSync(logsDir, { recursive: true });
      } catch (e) {
        // ignore
      }

      const credPath = path.join(logsDir, 'admin-credentials.txt');
      const contentLines = [
        `Admin account created: ${new Date().toISOString()}`,
        `Login URL: http://localhost:${PORT}/admin/login (POST)`,
        `Email: ${defaultEmail}`,
        `Password: ${defaultPassword}`,
      ];
      try {
        fs.writeFileSync(credPath, contentLines.join('\n'));
        console.log(`Temporary admin credentials saved to ${credPath}`);
      } catch (e) {
        console.error('Failed to write admin credentials to file:', e.message);
      }

      console.log('Default admin account created');
      console.log(`Default admin email: ${defaultEmail}`);
      if (tempPasswordCreated) {
        console.log('A temporary admin password was generated. See backend/logs/admin-credentials.txt.');
      }
    }

    const defaultCustomerEmail = process.env.DEFAULT_CUSTOMER_EMAIL || 'customer@blizzbeautified.com';
    const defaultCustomerPassword = process.env.DEFAULT_CUSTOMER_PASSWORD || 'Customer1234';
    const existingCustomer = await User.findOne({ email: defaultCustomerEmail });
    if (!existingCustomer) {
      await User.create({
        name: 'Customer',
        email: defaultCustomerEmail,
        password: defaultCustomerPassword,
        role: 'customer',
        isActive: true,
      });
      console.log(`Default customer account created: ${defaultCustomerEmail}`);
    }
  } catch (error) {
    console.error('Auth bootstrap error:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server ready on port ${PORT}`);
  });
}

bootstrap();