import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars here too — ES module imports are hoisted so dotenv in server.js
// runs AFTER this module has already been evaluated.
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!admin.apps.length) {
  let serviceAccount;

  const envJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (envJson) {
    // ── Production (Render): load from environment variable ──────────
    try {
      serviceAccount = JSON.parse(envJson);
    } catch {
      // Maybe base64-encoded
      serviceAccount = JSON.parse(Buffer.from(envJson, 'base64').toString('utf8'));
    }
    // Fix escaped newlines in private key (common in env vars)
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
  } else {
    // ── Local dev: fall back to serviceAccountKey.json ───────────────
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
