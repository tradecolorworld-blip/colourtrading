import mongoose from 'mongoose';

const JalwaUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true }, // 🟢 Email instead of Phone
  password: { type: String, required: true },
  isVip: { type: Boolean, default: false },
  vipExpiry: { type: Date, default: null }, 
  createdAt: { type: Date, default: Date.now },
  purchaseDate: { type: Date, default: null }
});

const JalwaUser = mongoose.model('JalwaUser', JalwaUserSchema);
// module.exports = NeonUser;
export default JalwaUser;