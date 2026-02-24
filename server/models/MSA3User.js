import mongoose from 'mongoose';

const MASUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVip: { type: Boolean, default: false },
    vipExpiry: { type: Date },
    purchaseDate: { type: Date },
}, { timestamps: true });

export default mongoose.model('MSA3User', MASUserSchema);