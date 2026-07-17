const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { sendSuccess, sendError } = require('../utilities/response');
const { requireAdmin } = require('../middleware/auth');
const { upload } = require('../services/uploadService');
const router = express.Router();

const fallbackProducts = [
  {
    _id: 'fallback-product-1',
    id: 'fallback-product-1',
    name: 'Luxury Braided Wig',
    slug: 'luxury-braided-wig',
    description: 'A hand-finished braided wig designed for elevated texture and comfort.',
    price: 185000,
    category: 'Braided Wigs',
    images: ['/uploads/braided-wigs/braided-wig-01.jpeg'],
    currency: 'NGN',
    isActive: true,
    featured: true,
    bestSeller: true,
    newArrival: true,
    tags: ['braided', 'luxury'],
  },
  {
    _id: 'fallback-product-2',
    id: 'fallback-product-2',
    name: 'Elegant Human Hair Wig',
    slug: 'elegant-human-hair-wig',
    description: 'Soft, natural-looking texture with premium movement and style retention.',
    price: 220000,
    category: 'Human Hair',
    images: ['/uploads/braided-wigs/braided-wig-02.jpeg'],
    currency: 'NGN',
    isActive: true,
    featured: true,
    bestSeller: false,
    newArrival: false,
    tags: ['human-hair', 'premium'],
  },
];

let inMemoryProducts = fallbackProducts.map((product) => ({ ...product }));

function normalizeImageValue(value) {
  if (!value) return '';
  if (typeof value !== 'string') return '';

  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/uploads/')) return trimmed;
  if (trimmed.startsWith('/')) return trimmed;

  return `/uploads/${trimmed.replace(/^\/+/, '')}`;
}

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];
  return images
    .map((image) => normalizeImageValue(image))
    .filter(Boolean);
}

function normalizeBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  return Boolean(value);
}

function buildProductFromPayload(payload) {
  const price = Number(payload.price || 0);
  const tags = typeof payload.tags === 'string'
    ? payload.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    : Array.isArray(payload.tags)
      ? payload.tags
      : [];

  return {
    _id: payload._id || payload.id || `fallback-${Date.now()}`,
    id: payload.id || payload._id || `fallback-${Date.now()}`,
    name: payload.name || 'Untitled product',
    slug: payload.slug || (payload.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: payload.description || '',
    price: Number.isFinite(price) ? price : 0,
    category: payload.category || 'General',
    images: normalizeImages(Array.isArray(payload.images) ? payload.images : []),
    currency: payload.currency || 'NGN',
    isActive: payload.isActive !== false,
    featured: normalizeBoolean(payload.featured),
    bestSeller: normalizeBoolean(payload.bestSeller),
    newArrival: normalizeBoolean(payload.newArrival),
    sale: normalizeBoolean(payload.sale),
    outOfStock: normalizeBoolean(payload.outOfStock),
    inventory: Number(payload.inventory || 0),
    tags,
  };
}

function listFallbackProducts(activeOnly = false) {
  return inMemoryProducts
    .filter((product) => (activeOnly ? product.isActive !== false : true))
    .slice()
    .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
}

function createFallbackProduct(payload) {
  const product = buildProductFromPayload({ ...payload, createdAt: new Date().toISOString() });
  inMemoryProducts = [product, ...inMemoryProducts];
  return product;
}

function updateFallbackProduct(id, payload) {
  const normalizedId = String(id);
  const index = inMemoryProducts.findIndex((product) => String(product._id || product.id) === normalizedId);
  if (index === -1) return null;

  const updated = buildProductFromPayload({ ...inMemoryProducts[index], ...payload, _id: inMemoryProducts[index]._id, id: inMemoryProducts[index].id, createdAt: inMemoryProducts[index].createdAt });
  inMemoryProducts[index] = updated;
  return updated;
}

function deleteFallbackProduct(id) {
  const normalizedId = String(id);
  const before = inMemoryProducts.length;
  inMemoryProducts = inMemoryProducts.filter((product) => String(product._id || product.id) !== normalizedId);
  return inMemoryProducts.length < before;
}

async function getProductsFromDatabase(activeOnly = false) {
  const query = activeOnly ? { isActive: true } : {};
  const products = await Product.find(query).sort({ createdAt: -1 });
  return products.map((product) => {
    const plainProduct = product.toObject ? product.toObject() : product;
    return {
      ...plainProduct,
      images: normalizeImages(plainProduct.images || []),
    };
  });
}

router.get('/all', requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return sendSuccess(res, 200, listFallbackProducts(false), 'Products fetched');
    }

    const products = await getProductsFromDatabase(false);
    return sendSuccess(res, 200, products, 'Products fetched');
  } catch (error) {
    console.warn('Product listing fell back to local products:', error.message);
    return sendSuccess(res, 200, listFallbackProducts(false), 'Products fetched');
  }
});

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return sendSuccess(res, 200, listFallbackProducts(true), 'Products fetched');
    }

    const products = await getProductsFromDatabase(true);
    return sendSuccess(res, 200, products, 'Products fetched');
  } catch (error) {
    console.warn('Public product listing fell back to local products:', error.message);
    return sendSuccess(res, 200, listFallbackProducts(true), 'Products fetched');
  }
});

router.post('/', requireAdmin, upload.array('images', 8), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

  try {
    if (mongoose.connection.readyState !== 1) {
      const payload = { ...req.body };
      if (req.files && req.files.length) payload.images = req.files.map((file) => `/uploads/${file.filename}`);
      const product = createFallbackProduct(payload);
      return sendSuccess(res, 201, product, 'Product created');
    }

    const payload = { ...req.body };
    if (req.files && req.files.length) payload.images = req.files.map((file) => `/uploads/${file.filename}`);
    if (typeof payload.tags === 'string') {
      payload.tags = payload.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }
    if (payload.name && !payload.slug) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    const product = await Product.create(payload);
    return sendSuccess(res, 201, product, 'Product created');
  } catch (error) {
    console.error('Product creation failed:', error.message);
    return sendError(res, 400, error.message || 'Unable to create product');
  }
});

router.put('/:id', requireAdmin, upload.array('images', 8), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const payload = { ...req.body };
      if (req.files && req.files.length) payload.images = req.files.map((file) => `/uploads/${file.filename}`);
      const product = updateFallbackProduct(req.params.id, payload);
      if (!product) return sendError(res, 404, 'Product not found');
      return sendSuccess(res, 200, product, 'Product updated');
    }

    const payload = { ...req.body };
    if (req.files && req.files.length) payload.images = req.files.map((file) => `/uploads/${file.filename}`);
    if (typeof payload.tags === 'string') {
      payload.tags = payload.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!product) return sendError(res, 404, 'Product not found');
    return sendSuccess(res, 200, product, 'Product updated');
  } catch (error) {
    console.error('Product update failed:', error.message);
    return sendError(res, 400, error.message || 'Unable to update product');
  }
});

router.patch('/:id', requireAdmin, upload.array('images', 8), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const payload = { ...req.body };
      if (req.files && req.files.length) payload.images = req.files.map((file) => `/uploads/${file.filename}`);
      const product = updateFallbackProduct(req.params.id, payload);
      if (!product) return sendError(res, 404, 'Product not found');
      return sendSuccess(res, 200, product, 'Product updated');
    }

    const payload = { ...req.body };
    if (req.files && req.files.length) payload.images = req.files.map((file) => `/uploads/${file.filename}`);
    if (typeof payload.tags === 'string') {
      payload.tags = payload.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!product) return sendError(res, 404, 'Product not found');
    return sendSuccess(res, 200, product, 'Product updated');
  } catch (error) {
    console.error('Product update failed:', error.message);
    return sendError(res, 400, error.message || 'Unable to update product');
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const deleted = deleteFallbackProduct(req.params.id);
      if (!deleted) return sendError(res, 404, 'Product not found');
      return sendSuccess(res, 200, null, 'Product deleted');
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return sendError(res, 404, 'Product not found');
    return sendSuccess(res, 200, null, 'Product deleted');
  } catch (error) {
    console.error('Product deletion failed:', error.message);
    return sendError(res, 400, error.message || 'Unable to delete product');
  }
});

module.exports = router;
