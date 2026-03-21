import Product from './product.model.js';

const SEED_DATA = [
  { name: 'Aura Pro Studio',     color: 'Ivory White',     price: 3490, img: 'image8.jpg',  tag: 'Bestseller' },
  { name: 'Aura Elite ANC',      color: 'Obsidian Black',  price: 3990, img: 'image9.jpg',  tag: 'New'        },
  { name: 'Aura Lite Wireless',  color: 'Rose Quartz',     price: 1990, img: 'image3.jpg',  tag: null         },
  { name: 'Aura Play Gaming',    color: 'Stealth Black',   price: 2490, img: 'image4.jpg',  tag: null         },
  { name: 'Aura Classic',        color: 'Pearl White',     price: 2990, img: 'image6.png',  tag: null         },
  { name: 'Aura Command X',      color: 'Carbon Chrome',   price: 4490, img: 'image2.jpg',  tag: 'Premium'    },
  { name: 'Aura DJ Master',      color: 'Platinum Silver', price: 3290, img: 'image7.jpg',  tag: null         },
  { name: 'Aura Air Minimalist', color: 'Bone White',      price: 1790, img: 'image5.jpg',  tag: null         },
  { name: 'Aura Forge Elite',    color: 'Gunmetal',        price: 4590, img: 'image10.jpg', tag: 'Pro'        },
  { name: 'Aura QuietComfort',   color: 'Midnight Blue',   price: 5490, img: 'image11.jpg', tag: 'Bestseller' },
  { name: 'Aura BassTune',       color: 'Matte Black',     price: 2190, img: 'image12.jpg', tag: null         },
  { name: 'Aura Streamer Pro',   color: 'Cyber Orange',    price: 3190, img: 'image13.jpg', tag: 'Gaming'     },
  { name: 'Aura Retro Major',    color: 'Classic Black',   price: 2790, img: 'image14.jpg', tag: 'Classic'    },
  { name: 'Aura Fold Go',        color: 'Sand Beige',      price: 1590, img: 'image15.jpg', tag: null         },
  { name: 'Aura Studio Monitor', color: 'Studio Black',    price: 3890, img: 'image16.jpg', tag: 'Pro'        },
  { name: 'Aura Studio V2',      color: 'Graphite',        price: 4190, img: 'image17.jpg', tag: null         },
  { name: 'Aura Pure Bass',      color: 'Onyx Black',      price: 1990, img: 'image18.jpg', tag: null         },
];

// ─── GET /api/products ────────────────────────────────────────
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/products/:id ────────────────────────────────────
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    res.status(500).json({ message: error.message });
  }
};

// ─── POST /api/products/seed ──────────────────────────────────
// One-time seed endpoint — protected by SEED_SECRET header
export const seedProducts = async (req, res) => {
  const secret = req.headers['x-seed-secret'];
  if (!secret || secret !== process.env.SEED_SECRET) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const existing = await Product.countDocuments();
    const force    = req.query.force === 'true';

    if (existing > 0 && !force) {
      return res.status(200).json({
        message: `${existing} products already exist. Add ?force=true to overwrite.`,
        count: existing,
      });
    }

    if (force) {
      await Product.deleteMany({});
    }

    const inserted = await Product.insertMany(SEED_DATA);
    res.status(201).json({ message: `Seeded ${inserted.length} products.`, count: inserted.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
