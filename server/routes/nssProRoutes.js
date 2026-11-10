import express from 'express';
import axios from 'axios';
import NSSProUser from '../models/NSSProUser.js';
import multer from 'multer'; // 🟢 Multer import karo
import path from 'path';
import fs from 'fs';
import NSSProUSDT from '../models/NSSProUSDT.js';

const router = express.Router();
// Inheriting your global token structure
const apiToken = 'fb0f82-a17824-772b82-b7a63b-9cad54';

// 🟢 Auto-create the uploads folder if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 🟢 Multer Configuration for USDT Screenshots
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        cb(null, 'usdt_' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 1. Signup API
router.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const existingUser = await NSSProUser.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new NSSProUser({ name, email, phone, password });
        await newUser.save();

        res.status(201).json({ message: "Account created successfully", user: newUser });
    } catch (err) {
        res.status(500).json({ message: "Server error during signup", error: err.message });
    }
});

// 2. Login API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await NSSProUser.findOne({ email: email.toLowerCase(), password });
        if (!user) return res.status(401).json({ message: "Invalid login details" });

        // Auto-check for VIP expiration
        if (user.isVip && user.vipExpiry && new Date() > user.vipExpiry) {
            user.isVip = false;
            await user.save();
        }

        res.json({ message: "Login successful", user });
    } catch (err) {
        res.status(500).json({ message: "Server error during login" });
    }
});

// 3. Check VIP Status
router.post('/check-vip', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await NSSProUser.findOne({ email: email.toLowerCase() });

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

// 4. Create Payment Order (₹899)
router.post('/payment/create', async (req, res) => {
    const { email } = req.body;
    const order_id = `NSSPRO_` + Date.now();
    const domain = req.headers.host;

    // Matching the ₹899 amount from your HTML modal
    const basePrice = 1;
    const randomPaisa = 0;
    const finalAmount = parseFloat((basePrice + randomPaisa).toFixed(2));

    const paymentData = {
        token: apiToken,
        order_id: order_id,
        txn_amount: finalAmount,
        txn_note: `Number SureShot Pro VIP`,
        product_name: `NSS Pro`,
        customer_name: "User_" + email.split('@')[0],
        customer_mobile: "9999999999",
        customer_email: email,
        redirect_url: `https://${domain}/portal`
        // redirect_url: `http://localhost:5173/portal`
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

// 5. Verify Status & Activate VIP
router.post('/payment/status', async (req, res) => {
    const { order_id, email } = req.body;

    try {
        const response = await axios.post('https://allapi.in/order/status', {
            token: apiToken,
            order_id: order_id
        });

        if (response.data.status === true && response.data.results.status === "Success") {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 17); // HTML stated 17 days validity
            const now = new Date();

            const updatedUser = await NSSProUser.findOneAndUpdate(
                { email: email.toLowerCase() },
                { isVip: true, vipExpiry: expiryDate, purchaseDate: now },
                { new: true }
            );

            return res.json({
                status: "Success",
                user: updatedUser,
                message: "Payment verified and VIP activated!"
            });
        }
        res.json({ status: "Pending" });
    } catch (err) {
        res.status(500).json({ message: "Error checking status" });
    }
});

// 6. Admin Manual VIP Activation
router.post('/admin/activate-vip', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const now = new Date();
        const expiryDate = new Date();
        expiryDate.setDate(now.getDate() + 17);

        const updatedUser = await NSSProUser.findOneAndUpdate(
            { email: email.toLowerCase() },
            { isVip: true, vipExpiry: expiryDate, purchaseDate: now },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json({
            status: "Success",
            message: `VIP Activated for ${email}`,
            expiry: expiryDate
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// --- 🟢 USDT MANUAL PAYMENT ROUTE ---

router.post('/payment/usdt-submit', upload.single('screenshot'), async (req, res) => {
    try {
        const { txn_id, email } = req.body;

        if (!txn_id || !email) {
            return res.status(400).json({ success: false, message: "Transaction ID and Email are required" });
        }

        // Check if transaction ID already exists to prevent duplicate submissions
        const existingTxn = await NSSProUSDT.findOne({ txn_id });
        if (existingTxn) {
            return res.status(400).json({ success: false, message: "Transaction ID already submitted." });
        }

        // Generate image URL path
        const screenshotUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Save to Database
        await NSSProUSDT.create({
            email: email.toLowerCase(),
            txn_id: txn_id,
            screenshot: screenshotUrl
        });

        res.json({ success: true, message: "Submitted! We will verify within 24h." });
    } catch (err) {
        console.error("USDT Upload Error:", err);
        res.status(500).json({ success: false, message: "Server error during submission" });
    }
});


// --- 🟢 ADMIN PANEL ROUTES ---

// Admin: Get all pending USDT requests
router.get('/admin/usdt-requests', async (req, res) => {
    try {
        const pendingRequests = await NSSProUSDT.find({ status: 'Pending' }).sort({ createdAt: -1 });
        res.json({ success: true, data: pendingRequests });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching requests" });
    }
});

// Admin: Approve USDT & Activate VIP
router.post('/admin/approve-usdt', async (req, res) => {
    const { requestId, email } = req.body;

    try {
        // 1. Update Request Status to Approved
        await NSSProUSDT.findByIdAndUpdate(requestId, { status: 'Approved' });

        // 2. Activate VIP for User
        const now = new Date();
        const expiryDate = new Date();
        expiryDate.setDate(now.getDate() + 17);

        const updatedUser = await NSSProUser.findOneAndUpdate(
            { email: email.toLowerCase() },
            { isVip: true, vipExpiry: expiryDate, purchaseDate: now },
            { new: true }
        );

        res.json({ success: true, message: `USDT Approved and VIP Activated for ${email}`, user: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export default router;