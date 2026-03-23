import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  color: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  img:   { type: String, required: true },
  images: [{ type: String }],
  tag:   { type: String, default: null }, 
  category: { type: String, default: 'Uncategorized' },
  stock: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
