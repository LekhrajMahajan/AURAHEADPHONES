import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!admin.apps.length) {
  let serviceAccount;

  const envJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (envJson) {

    try {
      serviceAccount = JSON.parse(envJson);
    } catch {

      serviceAccount = JSON.parse(Buffer.from(envJson, 'base64').toString('utf8'));
    }

    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
  } else {

    const keyPath = path.resolve(__dirname, './serviceAccountKey.json');
    if (!existsSync(keyPath)) {
      throw new Error(
        'Firebase: set FIREBASE_SERVICE_ACCOUNT env var or add serviceAccountKey.json to backend/src/config/'
      );
    }
    const require = createRequire(import.meta.url);
    serviceAccount = require('./serviceAccountKey.json');
  }

  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  console.log('Firebase Admin Initialized');
}

export default admin;
