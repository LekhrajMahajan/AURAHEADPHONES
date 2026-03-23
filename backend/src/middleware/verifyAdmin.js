import jwt from 'jsonwebtoken';

export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aura_admin_fallback_secret');

      req.admin = { id: decoded.id, role: decoded.role };

      if (decoded.role !== 'superadmin' && decoded.role !== 'staff') {
        return res.status(403).json({ message: 'Not authorized as an admin' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
