import mongoose from 'mongoose';

const APRUserSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    isVip: { type: Boolean, default: false },
    vipExpiry: { type: Date },
    purchaseDate: { type: Date },
}, { timestamps: true });

export default mongoose.model('APRUser2', APRUserSchema);