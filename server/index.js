import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import User from './models/User.js';
import NeonUser from './models/NeonUser.js';
import JalwaUser from './models/JalwaUser.js';
import SureShotUser from './models/SureShotUser.js';
import NumberHackUser from './models/NumberHackUser.js';
import WinGoUser from './models/WingoUser.js';

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

// --- ADMIN DASHBOARD API ---
// --- ADMIN DASHBOARD API ---
app.get('/api/admin/stats', async (req, res) => {
    try {
        const collections = [
            { name: 'Original', model: User, price: 950 },
            { name: 'Neon', model: NeonUser, price: 650 },
            { name: 'Jalwa', model: JalwaUser, price: 499 },
            { name: 'SureShot', model: SureShotUser, price: 450 },
            { name: 'NumberHack', model: NumberHackUser, price: 700 },
            { name: 'WinGo', model: WinGoUser } 
        ];

        let totalUsers = 0;
        let totalVipUsers = 0;
        let vipList = [];

        for (const col of collections) {
            const users = await col.model.find({});
            totalUsers += users.length;

            const vips = users.filter(u => u.isVip);
            totalVipUsers += vips.length;

            vips.forEach(u => {
                // Handle dynamic pricing for WinGo based on planType
                let actualPrice = col.price;
                if (col.name === 'WinGo') {
                    actualPrice = u.planType === 'SUPER_PRO' ? 999 : 599;
                }

                vipList.push({
                    id: u._id,
                    identifier: u.phone || u.email,
                    mod: col.name,
                    price: actualPrice,
                    expiry: u.vipExpiresAt || u.vipExpiry,
                    purchasedAt: u.purchaseDate || u.createdAt
                });
            });
        }

        // 🟢 Sort by latest purchase date first
        vipList.sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt));

        res.json({ totalUsers, totalVipUsers, vipList });
    } catch (err) {
        res.status(500).json({ message: "Admin data fetch failed" });
    }
});

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
        const now = new Date();

        const user = await User.findOneAndUpdate(
            { phone },
            { isVip: true, vipExpiresAt: expiryDate, purchaseDate: now },
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
            const now = new Date();

            const updatedUser = await User.findOneAndUpdate(
                { phone: phone },
                { isVip: true, vipExpiresAt: expiryDate, purchaseDate: now },
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
            const now = new Date();

            const updatedUser = await NeonUser.findOneAndUpdate(
                { email: email.toLowerCase() },
                { isVip: true, vipExpiry: expiryDate, purchaseDate: now },
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

// --- JALWA BACKEND APIs ---

// 🟢 1. Signup API
app.post('/api/jalwa/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Search in a dedicated JalwaUser collection (or use a 'mod' flag)
        const existingUser = await JalwaUser.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new JalwaUser({ email: email.toLowerCase(), password });
        await newUser.save();
        res.status(201).json({ message: "Jalwa account created successfully", user: newUser });
    } catch (err) {
        res.status(500).json({ message: "Server error during Jalwa signup" });
    }
});

// 🟢 2. Login API
app.post('/api/jalwa/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await JalwaUser.findOne({ email: email.toLowerCase(), password });
        if (!user) return res.status(401).json({ message: "Invalid Jalwa login details" });

        res.json({ message: "Jalwa Login successful", user });
    } catch (err) {
        res.status(500).json({ message: "Server error during Jalwa login" });
    }
});

// 🟢 3. Check VIP Status (Includes auto-expiry for 28 days)
app.post('/api/jalwa/check-vip', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await JalwaUser.findOne({ email: email.toLowerCase() });

        if (!user || !user.isVip) {
            return res.json({ isVip: false });
        }

        // Check if VIP has expired
        if (new Date() > user.vipExpiry) {
            user.isVip = false;
            await user.save();
            return res.json({ isVip: false, message: "Jalwa VIP Expired" });
        }

        res.json({ isVip: true, expiry: user.vipExpiry });
    } catch (err) {
        res.status(500).json({ message: "Error checking Jalwa status" });
    }
});

// 🟢 4. Create Jalwa Payment Order (₹899)
app.post('/api/jalwa/payment/create', async (req, res) => {
    const { email } = req.body;
    const order_id = "JALWA" + Date.now(); // Unique prefix for Jalwa orders

    const paymentData = {
        token: "a86f69-675d92-da4e54-2886a7-0ce845",
        order_id: order_id,
        txn_amount: 499, // 🟢 Set to 899 as per Jalwa design
        txn_note: "Jalwa VIP Subscription",
        product_name: "Jalwa Premium Access",
        customer_name: "JalwaUser_" + email.split('@')[0],
        customer_mobile: "9999999999",
        customer_email: email.toLowerCase(),
        redirect_url: "https://colourtradingworld.sbs/jalwa/dashboard"
    };

    try {
        const response = await axios.post('https://allapi.in/order/create', paymentData);
        res.json({
            ...response.data,
            results: { ...response.data.results, order_id }
        });
    } catch (err) {
        res.status(500).json({ message: "Jalwa payment initialization failed" });
    }
});

// 🟢 5. Verify Status & Activate VIP
app.post('/api/jalwa/payment/status', async (req, res) => {
    const { order_id, email } = req.body;

    try {
        const response = await axios.post('https://allapi.in/order/status', {
            token: "a86f69-675d92-da4e54-2886a7-0ce845",
            order_id: order_id
        });

        if (response.data.status === true && response.data.results.status === "Success") {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 28); // 🟢 28 days validity
            const now = new Date();

            const updatedUser = await JalwaUser.findOneAndUpdate(
                { email: email.toLowerCase() },
                { isVip: true, vipExpiry: expiryDate, purchaseDate: now },
                { new: true }
            );

            if (!updatedUser) return res.status(404).json({ message: "Jalwa user not found" });

            return res.json({
                status: "Success",
                user: updatedUser,
                message: "Payment verified and Jalwa VIP activated!"
            });
        }
        res.json({ status: "Pending", message: "Payment not completed" });
    } catch (err) {
        res.status(500).json({ message: "Error checking Jalwa payment status" });
    }
});

// --- SURESHOT BACKEND APIs ---

// 🟢 1. Signup with Auto-Login
app.post('/api/sureshot/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await SureShotUser.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new SureShotUser({
            email: email.toLowerCase(),
            password,
            fullName: name
        });
        await newUser.save();

        // Return user object for immediate frontend session storage
        res.status(201).json({ message: "Account created successfully", user: newUser });
    } catch (err) {
        res.status(500).json({ message: "Server error during SureShot signup" });
    }
});

// 🟢 2. Login API
app.post('/api/sureshot/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await SureShotUser.findOne({ email: email.toLowerCase(), password });
        if (!user) return res.status(401).json({ message: "Invalid login details" });

        res.json({ message: "Login successful", user });
    } catch (err) {
        res.status(500).json({ message: "Server error during SureShot login" });
    }
});

// 🟢 3. VIP Status Check (28-day auto-expiry)
app.post('/api/sureshot/check-vip', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await SureShotUser.findOne({ email: email.toLowerCase() });

        if (!user || !user.isVip) return res.json({ isVip: false });

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

// 🟢 4. Create Order (₹655)
app.post('/api/sureshot/payment/create', async (req, res) => {
    const { email } = req.body;
    const order_id = "SURE" + Date.now(); // Unique prefix for SureShot tracking

    const paymentData = {
        token: "a86f69-675d92-da4e54-2886a7-0ce845",
        order_id: order_id,
        txn_amount: 450, // 🟢 Set to ₹655 as per UI
        txn_note: "SureShot VIP Subscription",
        product_name: "SureShot Premium",
        customer_name: "SureUser_" + email.split('@')[0],
        customer_mobile: "9999999999",
        customer_email: email.toLowerCase(),
        redirect_url: "https://colourtradingworld.sbs/sureshot/dashboard"
    };

    try {
        const response = await axios.post('https://allapi.in/order/create', paymentData);
        res.json({ ...response.data, results: { ...response.data.results, order_id } });
    } catch (err) {
        res.status(500).json({ message: "Payment initialization failed" });
    }
});

// 🟢 5. Verify & Activate
app.post('/api/sureshot/payment/status', async (req, res) => {
    const { order_id, email } = req.body;
    try {
        const response = await axios.post('https://allapi.in/order/status', {
            token: "a86f69-675d92-da4e54-2886a7-0ce845",
            order_id: order_id
        });

        if (response.data.status === true && response.data.results.status === "Success") {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 28); // 28 days validity
            const now = new Date();

            const updatedUser = await SureShotUser.findOneAndUpdate(
                { email: email.toLowerCase() },
                { isVip: true, vipExpiry: expiryDate, purchaseDate: now },
                { new: true }
            );

            return res.json({ status: "Success", user: updatedUser });
        }
        res.json({ status: "Pending" });
    } catch (err) {
        res.status(500).json({ message: "Verification error" });
    }
});



// 🟢 1. Signup API with Auto-Login
app.post('/api/numberhack/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await NumberHackUser.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new NumberHackUser({ email: email.toLowerCase(), password });
        await newUser.save();

        // 🟢 Auto-Login: Return the user object immediately so frontend can redirect
        res.status(201).json({
            message: "Number Hack account created successfully",
            user: newUser
        });
    } catch (err) {
        res.status(500).json({ message: "Server error during NumberHack signup" });
    }
});

// 🟢 2. Login API
app.post('/api/numberhack/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await NumberHackUser.findOne({ email: email.toLowerCase(), password });
        if (!user) return res.status(401).json({ message: "Invalid login details" });

        res.json({ message: "Login successful", user });
    } catch (err) {
        res.status(500).json({ message: "Server error during login" });
    }
});

// 🟢 3. Check VIP Status (28-day auto-expiry)
app.post('/api/numberhack/check-vip', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await NumberHackUser.findOne({ email: email.toLowerCase() });

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

// 🟢 4. Create Payment Order (₹499)
app.post('/api/numberhack/payment/create', async (req, res) => {
    const { email } = req.body;
    const order_id = "NUM" + Date.now(); // Unique prefix for NumberHack

    const paymentData = {
        token: "a86f69-675d92-da4e54-2886a7-0ce845",
        order_id: order_id,
        txn_amount: 700, // 🟢 Discounted price
        txn_note: "Number VIP Subscription",
        product_name: "Number Premium",
        customer_name: "NumUser_" + email.split('@')[0],
        customer_mobile: "9999999999",
        customer_email: email.toLowerCase(),
        redirect_url: "https://colourtradingworld.sbs/numberhack/dashboard"
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

// 🟢 5. Verify Status & Activate VIP
app.post('/api/numberhack/payment/status', async (req, res) => {
    const { order_id, email } = req.body;

    try {
        const response = await axios.post('https://allapi.in/order/status', {
            token: "a86f69-675d92-da4e54-2886a7-0ce845",
            order_id: order_id
        });

        if (response.data.status === true && response.data.results.status === "Success") {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 28); // 28 days validity
            const now = new Date();

            const updatedUser = await NumberHackUser.findOneAndUpdate(
                { email: email.toLowerCase() },
                { isVip: true, vipExpiry: expiryDate, purchaseDate: now },
                { new: true }
            );

            return res.json({
                status: "Success",
                user: updatedUser,
                message: "Payment verified and NumberHack VIP activated!"
            });
        }
        res.json({ status: "Pending" });
    } catch (err) {
        res.status(500).json({ message: "Error checking payment status" });
    }
});

// --- WIN GO HACK BACKEND APIs ---

// 🟢 1. Signup API with Auto-Login
app.post('/api/wingo/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await WinGoUser.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new WinGoUser({ email: email.toLowerCase(), password });
        await newUser.save();

        res.status(201).json({
            message: "WinGo account created successfully",
            user: newUser
        });
    } catch (err) {
        res.status(500).json({ message: "Server error during WinGo signup" });
    }
});

// 🟢 2. Login API
app.post('/api/wingo/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await WinGoUser.findOne({ email: email.toLowerCase(), password });
        if (!user) return res.status(401).json({ message: "Invalid login details" });

        res.json({ message: "Login successful", user });
    } catch (err) {
        res.status(500).json({ message: "Server error during login" });
    }
});

// 🟢 3. Check VIP Status (Tiered Auto-Expiry)
app.post('/api/wingo/check-vip', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await WinGoUser.findOne({ email: email.toLowerCase() });

        if (!user || !user.isVip) return res.json({ isVip: false });

        if (new Date() > user.vipExpiry) {
            user.isVip = false;
            user.planType = null;
            await user.save();
            return res.json({ isVip: false, message: "VIP Expired" });
        }

        res.json({ isVip: true, planType: user.planType, expiry: user.vipExpiry });
    } catch (err) {
        res.status(500).json({ message: "Error checking status" });
    }
});

// 🟢 4. Create Payment Order (PRO: ₹599 | SUPER_PRO: ₹999)
app.post('/api/wingo/payment/create', async (req, res) => {
    const { email, planType } = req.body; // planType is "PRO" or "SUPER_PRO"
    const order_id = "WINGO" + Date.now();

    // Set amount based on plan selection
    const amount = planType === "SUPER_PRO" ? 999 : 599;

    const paymentData = {
        token: "a86f69-675d92-da4e54-2886a7-0ce845",
        order_id: order_id,
        txn_amount: amount,
        txn_note: `WinGo ${planType} Subscription`,
        product_name: `WinGo ${planType}`,
        customer_name: "WinUser_" + email.split('@')[0],
        customer_mobile: "9999999999",
        customer_email: email.toLowerCase(),
        redirect_url: "https://colourtradingworld.sbs/wingo/dashboard"
    };

    try {
        const response = await axios.post('https://allapi.in/order/create', paymentData);
        res.json({
            ...response.data,
            results: { ...response.data.results, order_id, planType } // Pass planType back to track
        });
    } catch (err) {
        res.status(500).json({ message: "Payment initialization failed" });
    }
});

// 🟢 Verify Status & Activate VIP with Purchase Date
app.post('/api/wingo/payment/status', async (req, res) => {
    const { order_id, email, planType } = req.body;

    try {
        const response = await axios.post('https://allapi.in/order/status', {
            token: "a86f69-675d92-da4e54-2886a7-0ce845",
            order_id: order_id
        });

        if (response.data.status === true && response.data.results.status === "Success") {
            const now = new Date(); // 🟢 Capture current time as Purchase Date
            const expiryDate = new Date();
            const validityDays = planType === "SUPER_PRO" ? 28 : 21;
            expiryDate.setDate(now.getDate() + validityDays);

            const updatedUser = await WinGoUser.findOneAndUpdate(
                { email: email.toLowerCase() },
                {
                    isVip: true,
                    planType: planType,
                    purchaseDate: now, // 🟢 Save the purchase timestamp
                    vipExpiry: expiryDate
                },
                { new: true }
            );

            return res.json({
                status: "Success",
                user: updatedUser,
                message: `WinGo ${planType} activated!`
            });
        }
        res.json({ status: "Pending" });
    } catch (err) {
        res.status(500).json({ message: "Error checking status" });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));