import mongoose from 'mongoose';

// 🟢 1. Create Game Schema (Add this near your other models)
const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true }, // URL of the logo image
    link: { type: String, required: true },
    hot: { type: Boolean, default: false },
    variant: { type: String, required: true } // 'sure1', 'sure2', etc.
});
const Game = mongoose.model('SureShotGame', gameSchema);

export default Game;