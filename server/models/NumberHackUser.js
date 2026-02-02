import mongoose from 'mongoose';

const NumberHackUserSchema = new mongoose.Schema({
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
    vipExpiry: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const NumberHackUser = mongoose.model('NumberHackUser', NumberHackUserSchema);
export default NumberHackUser;