import mongoose from 'mongoose';

const WinGoUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isVip: {
        type: Boolean,
        default: false
    },
    planType: {
        type: String,
        enum: ['PRO', 'SUPER_PRO', null],
        default: null
    },
    vipExpiry: {
        type: Date,
        default: null
    },
    purchaseDate: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const WinGoUser = mongoose.model('WinGoUser', WinGoUserSchema);
export default WinGoUser;