import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import User from './models/User.js';
import NeonUser from './models/NeonUser.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- AUTH ROUTES ---

// 1. Create User (Signup)
app.post('/api/auth/register', async (req, res) => {
    const { phone, password } = req.body;
    try {
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ phone, password }); // Storing as plain text per your request
        await newUser.save();
        res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error during registration" });
    }
});

// 2. Login (with VIP Expiry Check)
app.post('/api/auth/login', async (req, res) => {
    const { phone, password } = req.body;
    try {
        const user = await User.findOne({ phone });

        if (!user || user.password !== password) {
            return res.status(400).json({ message: "Invalid login details" });
        }

        // Logic: Check if VIP has expired (14 days)
        if (user.isVip && user.vipExpiresAt && new Date() > user.vipExpiresAt) {
            user.isVip = false;
            user.vipExpiresAt = null;
            await user.save();
        }

        res.json({
            phone: user.phone,
            isVip: user.isVip,
            message: "Login successful"
        });
    } catch (err) {
        res.status(500).json({ message: "Server error during login" });
    }
});

// --- VIP MANAGEMENT ---

// 3. Make User VIP (14 Days)
app.post('/api/user/make-vip', async (req, res) => {
    const { phone } = req.body;
    try {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 14); // Set expiry to 14 days from now

        const user = await User.findOneAndUpdate(
            { phone },
            { isVip: true, vipExpiresAt: expiryDate },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            message: "VIP access granted for 14 days",
            expiresAt: user.vipExpiresAt
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating VIP status" });
    }
});

// 4. Create Payment Order
app.post('/api/payment/create', async (req, res) => {
    const { phone, amount } = req.body;

    // Generate a unique order ID for each transaction
    const order_id = "ORD" + Date.now();

    const paymentData = {
        token: "a86f69-675d92-da4e54-2886a7-0ce845", // From your documentation
        order_id: order_id,
        txn_amount: 950,
        txn_note: "VIP Subscription",
        product_name: "VIP",
        customer_name: "User_" + phone,
        customer_mobile: phone,
        customer_email: "customer@gmail.com", // Placeholder
        redirect_url: "https://colourtradingworld.sbs/dashboard" // Your frontend URL
    };

    try {
        const response = await axios.post('https://allapi.in/order/create', paymentData);
        // This returns the results.payment_url we need for the frontend

        const finalResponse = {
            ...response.data,
            results: {
                ...response.data.results,
                order_id: order_id // Now the frontend can see it!
            }
        };

        res.json(finalResponse);
        // res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Payment initialization failed" });
    }
});

// 5. Payment Webhook (Gateway calls this)
app.post('/api/payment/webhook', async (req, res) => {
    console.log("📥 RECEIVED WEBHOOK:", req.body);

    if (!req.body) {
        console.error("❌ Webhook received with no body data");
        return res.status(400).send("No body found");
    }

    const { status, customer_mobile, order_id } = req.body;

    if (status === "Success") {
        // Automatically give 14 days VIP if payment is successful
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 14);

        await User.findOneAndUpdate(
            { phone: customer_mobile },
            { isVip: true, vipExpiresAt: expiryDate }
        );
        console.log(`✅ Payment successful for ${customer_mobile}. VIP active.`);
    }

    res.sendStatus(200); // Tell gateway you received the message
});

// 6. Check Order Status
app.post('/api/payment/status', async (req, res) => {
    const { order_id } = req.body;

    const statusData = {
        token: "a86f69-675d92-da4e54-2886a7-0ce845", // Your API Token
        order_id: order_id
    };

    try {
        const response = await axios.post('https://allapi.in/order/status', statusData);

        // If the gateway confirms the payment was a "Success"
        if (response.data.status === true && response.data.results.status === "Success") {
            const phone = response.data.results.customer_mobile;

            // Activate VIP for 14 days
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 14);

            const updatedUser = await User.findOneAndUpdate(
                { phone: phone },
                { isVip: true, vipExpiresAt: expiryDate },
                { new: true }
            );

            return res.json({
                status: "Success",
                isVip: updatedUser.isVip,
                message: "Payment verified and VIP activated!"
            });
        }

        res.json({ status: "Pending", message: "Payment not completed yet" });
    } catch (err) {
        res.status(500).json({ message: "Error checking payment status" });
    }
});

//neon user 
// 🟢 1. Signup API
app.post('/api/neon/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await NeonUser.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new NeonUser({ email: email.toLowerCase(), password });
        await newUser.save();
        res.status(201).json({ message: "Account created successfully", newUser });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🟢 2. Login API
app.post('/api/neon/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await NeonUser.findOne({ email: email.toLowerCase(), password });
        if (!user) return res.status(401).json({ message: "Invalid login details" });

        res.json({ message: "Login successful", user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


// 🟢 4. Check VIP Status
app.post('/api/neon/check-vip', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await NeonUser.findOne({ email: email.toLowerCase() });

        if (!user || !user.isVip) {
            return res.json({ isVip: false });
        }

        // Auto-check for expiration
        if (new Date() > user.vipExpiry) {
            user.isVip = false;
            await user.save();
            return res.json({ isVip: false, message: "VIP Expired" });
        }

        res.json({ isVip: true, expiry: user.vipExpiry });
    } catch (err) {
        res.status(500).json({ message: "Error checking status" });
    }
});

// 4. Create Neon Payment Order (₹650)
app.post('/api/neon/payment/create', async (req, res) => {
    const { email } = req.body;
    const order_id = "NEON" + Date.now();

    const paymentData = {
        token: "a86f69-675d92-da4e54-2886a7-0ce845",
        order_id: order_id,
        txn_amount: 650, // 🟢 Updated to 650
        txn_note: "Neon VIP Subscription",
        product_name: "Neon Premium",
        customer_name: "User_" + email.split('@')[0],
        customer_mobile: "9999999999", // Placeholder
        customer_email: email.toLowerCase(),
        redirect_url: "https://colourtradingworld.sbs/neon/dashboard"
    };

    try {
        const response = await axios.post('https://allapi.in/order/create', paymentData);
        res.json({
            ...response.data,
            results: { ...response.data.results, order_id }
        });
    } catch (err) {
        res.status(500).json({ message: "Payment initialization failed" });
    }
});

// 5. Check Neon Payment Status & Activate VIP
app.post('/api/neon/payment/status', async (req, res) => {
    const { order_id, email } = req.body;

    try {
        const response = await axios.post('https://allapi.in/order/status', {
            token: "a86f69-675d92-da4e54-2886a7-0ce845",
            order_id: order_id
        });

        if (response.data.status === true && response.data.results.status === "Success") {
            // const email = response.data.results.customer_email;
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 28); // 🟢 28 days validity

            const updatedUser = await NeonUser.findOneAndUpdate(
                { email: email.toLowerCase() },
                { isVip: true, vipExpiry: expiryDate },
                { new: true }
            );

            if (!updatedUser) return res.status(404).json({ message: "User not found" });

            return res.json({
                status: "Success",
                user: updatedUser,
                message: "Payment verified and Neon VIP activated!"
            });
        }
        res.json({ status: "Pending", message: "Payment not completed" });
    } catch (err) {
        res.status(500).json({ message: "Error checking status" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));