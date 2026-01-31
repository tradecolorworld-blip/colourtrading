import mongoose from 'mongoose';

const SureShotUserSchema = new mongoose.Schema({
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
    fullName: {
        type: String,
        default: ""
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

const SureShotUser= mongoose.model('SureShotUser', SureShotUserSchema);
export default SureShotUser;