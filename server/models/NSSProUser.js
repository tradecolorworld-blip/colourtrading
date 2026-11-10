import mongoose from 'mongoose';

const NSSProUserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    isVip: { type: Boolean, default: false },
    vipExpiry: { type: Date },
    purchaseDate: { type: Date },
}, { timestamps: true });

export default mongoose.model('NSSProUser', NSSProUserSchema);