import mongoose from 'mongoose';

const NSSProUSDTSchema = new mongoose.Schema({
    email: { type: String, required: true },
    txn_id: { type: String, required: true, unique: true },
    screenshot: { type: String }, // Yeh image ka path store karega
    status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] }
}, { timestamps: true });

export default mongoose.model('NSSProUSDT', NSSProUSDTSchema);