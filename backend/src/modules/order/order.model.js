import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Product',
    required: false, 
  },
  name:     { type: String, required: true },
  img:      { type: String, default: '' },
  price:    { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1, default: 1 },
}, { _id: false }); 

const shippingAddressSchema = new mongoose.Schema({
  street:  { type: String, default: '' },
  city:    { type: String, default: '' },
  pincode: { type: String, default: '' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    index:    true, 
  },

  items:   { type: [orderItemSchema], required: true },
  total:   { type: Number, required: true, min: 0 },

  status:  { type: Number, default: 1, min: 1, max: 4 },

  paymentMethod:   { type: String, default: 'card', enum: ['card', 'upi', 'cod'] },
  shippingAddress: { type: shippingAddressSchema, default: {} },

}, { timestamps: true }); 

export default mongoose.model('Order', orderSchema);
