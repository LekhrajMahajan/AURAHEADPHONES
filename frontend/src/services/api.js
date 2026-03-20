import { auth } from '../config/firebase';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const waitForAuthUser = () => {
  return new Promise((resolve, reject) => {
    // Already available hai
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }

    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        unsubscribe();
        reject(new Error('Session expired. Please login again.'));
      }
    }, 8000);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && !resolved) {
        resolved = true;
        clearTimeout(timeout);
        unsubscribe();
        resolve(user);
      }
    });
  });
};

const getAuthHeaders = async () => {
  const user = await waitForAuthUser();
  const token = await user.getIdToken(true);
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

// ============ AUTH ============

export const syncUserWithBackend = async (firebaseUser) => {
  const token = await firebaseUser.getIdToken(true);
  const res = await fetch(`${BASE}/auth/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify({
      firebaseUid: firebaseUser.uid,
      name:        firebaseUser.displayName || 'Aura User',
      email:       firebaseUser.email,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Sync failed');
  }
  return res.json();
};

// ============ PRODUCTS ============

export const fetchProducts = async () => {
  const res = await fetch(`${BASE}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${BASE}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
};

// ============ USER PROFILE ============

export const getProfile = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE}/users/profile`, { headers });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export const updateProfile = async (data) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE}/users/profile`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
};

// ============ ORDERS ============

export const placeOrder = async (orderData) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Order failed');
  }
  return res.json();
};

export const fetchMyOrders = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE}/orders/myorders`, { headers });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};