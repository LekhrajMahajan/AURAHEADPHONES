import admin from '../config/firebase.js';
import User from '../modules/user/user.model.js';

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized — no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded.email_verified) {
      return res.status(403).json({
        message: 'Email not verified. Please verify your email first.',
      });
    }

    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      console.log(`User not found for uid: ${decoded.uid} — auto-creating...`);
      try {
        user = await User.create({
          firebaseUid: decoded.uid,
          name:  decoded.name  || decoded.email?.split('@')[0] || 'Aura User',
          email: decoded.email.toLowerCase(),
        });
        console.log(`Auto-created user: ${decoded.email}`);
      } catch (createErr) {
        if (createErr.code === 11000) {
          user = await User.findOne({
            $or: [
              { firebaseUid: decoded.uid },
              { email: decoded.email?.toLowerCase() },
            ],
          });
          console.log(`Found existing user after duplicate: ${decoded.email}`);
        } else {
          throw createErr;
        }
      }
    }

    if (!user) {
      return res.status(404).json({
        message: 'User not found. Please logout and login again.',
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Auth Middleware Error:', error.code, error.message);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Session expired. Please login again.' });
    }
    if (error.code === 'auth/argument-error' || error.code === 'auth/invalid-id-token') {
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }
    if (error.code === 'auth/user-disabled') {
      return res.status(403).json({ message: 'Account disabled. Contact support.' });
    }

    return res.status(401).json({ message: 'Authentication failed. Please login again.' });
  }
};

export default protect;