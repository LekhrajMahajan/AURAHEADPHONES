import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type:     String,
    unique:   true,
    required: true,
    index:    true, 
  },

  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, unique: true, lowercase: true, trim: true },

  phone:   { type: String, default: '' },
  address: { type: String, default: '' },
  city:    { type: String, default: '' },
  state:   { type: String, default: '' },
  pincode: { type: String, default: '' },

}, { timestamps: true }); 

export default mongoose.model('User', userSchema);
