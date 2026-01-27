import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Plain text as requested
  isVip: { type: Boolean, default: false },
  vipExpiresAt: { type: Date, default: null }
});

export default mongoose.model('User', userSchema);