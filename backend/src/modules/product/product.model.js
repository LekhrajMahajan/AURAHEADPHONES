import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  color: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  img:   { type: String, required: true },
  tag:   { type: String, default: null }, 
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
