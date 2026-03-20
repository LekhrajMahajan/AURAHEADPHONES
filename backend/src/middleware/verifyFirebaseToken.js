import admin from '../config/firebase.js';

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized — no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded.email_verified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email first.' });
    }

    req.firebaseUser = {
      uid:   decoded.uid,
      email: decoded.email,
      name:  decoded.name || decoded.display_name || 'Aura User',
    };

    next();

  } catch (error) {
    console.error('Token Verify Error:', error.message);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

export default verifyFirebaseToken;