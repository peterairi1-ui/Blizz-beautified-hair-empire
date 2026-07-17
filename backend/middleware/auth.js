const { verifyToken } = require('../authentication/jwt');
const User = require('../models/User');
const AdminUser = require('../models/AdminUser');

async function requireCustomer(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'Admin authentication required' });

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') return res.status(401).json({ success: false, message: 'Admin not authorized' });

    if (decoded.id === 'local-admin') {
      req.admin = { _id: 'local-admin', name: 'Administrator', email: 'admin@blizzbeautified.com', isActive: true };
      return next();
    }

    const admin = await AdminUser.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) return res.status(401).json({ success: false, message: 'Admin not authorized' });

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid admin token' });
  }
}

module.exports = { requireCustomer, requireAdmin };
