import Product from './product.model.js';
import { createClient } from 'redis';

// ─── REDIS SETUP ──────────────────────────────────────────────
const redisClient = createClient({
  url: process.env.REDIS_URI,
  socket: {
    reconnectStrategy: false
  }
});

redisClient.on('error', (err) => {
  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
  } else {
    console.error('Redis Client Error:', err);
  }
});

redisClient.connect().catch((err) => {
  console.warn(`Could not connect to Redis (${err.message}), caching is disabled.`);
});


// ─── GET /api/products ────────────────────────────────────────
export const getProducts = async (req, res) => {
  try {
    if (redisClient.isReady) {
      const cachedProducts = await redisClient.get('all_products');

      if (cachedProducts) {
        console.log('Serving products from Redis Cache ⚡');
        return res.status(200).json(JSON.parse(cachedProducts));
      }
    }
    console.log('Fetching products from MongoDB 🗄️');
    const products = await Product.find({}).sort({ createdAt: -1 });

    if (redisClient.isReady) {
      await redisClient.setEx('all_products', 3600, JSON.stringify(products));
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ─── GET /api/products/:id ────────────────────────────────────
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (redisClient.isReady) {
      const cachedProduct = await redisClient.get(`product_${id}`);

      if (cachedProduct) {
        console.log(`Serving product ${id} from Redis Cache ⚡`);
        return res.status(200).json(JSON.parse(cachedProduct));
      }
    }

    console.log(`Fetching product ${id} from MongoDB 🗄️`);
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (redisClient.isReady) {
      await redisClient.setEx(`product_${id}`, 3600, JSON.stringify(product));
    }

    res.status(200).json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    res.status(500).json({ message: error.message });
  }
};

// ─── POST /api/products (Admin) ───────────────────────────────
export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const createdProduct = await newProduct.save();

    if (redisClient.isReady) {
      await redisClient.del('all_products');
    }

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/products/:id (Admin) ────────────────────────────
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (redisClient.isReady) {
      await redisClient.del('all_products');
      await redisClient.del(`product_${id}`);
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid product ID format' });
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/products/:id (Admin) ─────────────────────────
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (redisClient.isReady) {
      await redisClient.del('all_products');
      await redisClient.del(`product_${id}`);
    }

    res.status(200).json({ message: 'Product removed' });
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid product ID format' });
    res.status(500).json({ message: error.message });
  }
};