import mongoose from 'mongoose';

const neonUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true }, // 🟢 Email instead of Phone
  password: { type: String, required: true },
  isVip: { type: Boolean, default: false },
  vipExpiry: { type: Date, default: null }, 
  createdAt: { type: Date, default: Date.now }
});

const NeonUser = mongoose.model('NeonUser', neonUserSchema);
// module.exports = NeonUser;
export default NeonUser;