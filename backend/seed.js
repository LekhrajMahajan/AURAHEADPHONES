import './dns-fix.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  tag: { type: String, default: null },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const PRODUCTS = [
  { id: 1, name: 'Aura Pro Studio', color: 'Ivory White', price: 3490, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201953/image8_cb8ujw.jpg', tag: 'Bestseller' },
  { id: 2, name: 'Aura Elite ANC', color: 'Obsidian Black', price: 3990, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201961/image9_bxeox8.jpg', tag: 'New' },
  { id: 3, name: 'Aura Lite Wireless', color: 'Rose Quartz', price: 1990, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201954/image3_b0dsx6.jpg', tag: null },
  { id: 4, name: 'Aura Play Gaming', color: 'Stealth Black', price: 2490, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201954/image4_dkmobc.jpg', tag: null },
  { id: 5, name: 'Aura Classic', color: 'Pearl White', price: 2990, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201973/image6_uyg7qn.png', tag: null },
  { id: 6, name: 'Aura Command X', color: 'Carbon Chrome', price: 4490, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201953/image2_vb6adk.jpg', tag: 'Premium' },
  { id: 7, name: 'Aura DJ Master', color: 'Platinum Silver', price: 3290, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201972/image7_xiukvm.jpg', tag: null },
  { id: 8, name: 'Aura Air Minimalist', color: 'Bone White', price: 1790, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201951/image5_wiprn7.jpg', tag: null },
  { id: 9, name: 'Aura Forge Elite', color: 'Gunmetal', price: 4590, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201971/image10_p7jcxy.jpg', tag: 'Pro' },
  { id: 10, name: 'Aura QuietComfort', color: 'Midnight Blue', price: 5490, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201974/image11_isgles.jpg', tag: 'Bestseller' },
  { id: 11, name: 'Aura BassTune', color: 'Matte Black', price: 2190, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201980/image12_vmmq39.jpg', tag: null },
  { id: 12, name: 'Aura Streamer Pro', color: 'Cyber Orange', price: 3190, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201968/image13_swsbpi.jpg', tag: 'Gaming' },
  { id: 13, name: 'Aura Retro Major', color: 'Classic Black', price: 2790, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201967/image14_vn2ukl.jpg', tag: 'Classic' },
  { id: 14, name: 'Aura Fold Go', color: 'Sand Beige', price: 1590, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201973/image15_g25mgs.jpg', tag: null },
  { id: 15, name: 'Aura Studio Monitor', color: 'Studio Black', price: 3890, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201976/image16_enkk0r.jpg', tag: 'Pro' },
  { id: 16, name: 'Aura Studio V2', color: 'Graphite', price: 4190, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201980/image17_sh5et6.jpg', tag: null },
  { id: 17, name: 'Aura Pure Bass', color: 'Onyx Black', price: 1990, img: 'https://res.cloudinary.com/dwb0fxukd/image/upload/v1774201982/image18_zp7xyp.jpg', tag: null },
];

// ── Seed Function ──────────────────────────────────────────────
const seedProducts = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected: ${mongoose.connection.host}`);

    // Existing products count check
    const existing = await Product.countDocuments();
    console.log(`Existing products in DB: ${existing}`);

    if (existing > 0) {
      console.log('\nProducts already exist in DB.');
      console.log('Options:');
      console.log('  → Delete all & re-seed:  node seed.js --force');
      console.log('  → Keep existing & skip:  (default — nothing done)\n');

      // --force flag se fresh seed karo
      if (process.argv.includes('--force')) {
        await Product.deleteMany({});
        console.log(' All existing products deleted.');
      } else {
        console.log('Skipping seed. Use --force to overwrite.\n');
        process.exit(0);
      }
    }

    const productsToInsert = PRODUCTS.map(({ id, ...rest }) => rest);

    const inserted = await Product.insertMany(productsToInsert);
    console.log(`\nSuccessfully seeded ${inserted.length} products!\n`);

    // Summary print karo
    inserted.forEach((p, i) => {
      console.log(`  ${String(i + 1).padStart(2, '0')}. ${p.name.padEnd(25)} ₹${p.price.toLocaleString('en-IN').padStart(6)}  ${p.tag ? `[${p.tag}]` : ''}`);
    });

    console.log(`\nTotal products in DB: ${await Product.countDocuments()}`);
    console.log('Seed complete!\n');

  } catch (error) {
    console.error('Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
};

seedProducts();