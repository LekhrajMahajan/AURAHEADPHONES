import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// Check if we have the environment variable for production
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('./serviceAccountKey.json.json'); // Fallback to file for local dev

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase Admin Initialized');
}

export default admin;
