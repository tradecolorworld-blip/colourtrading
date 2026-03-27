import axios from 'axios';

const apiToken = 'fb0f82-a17824-772b82-b7a63b-9cad54';

// 1st API: Create a test payment order with a custom amount
export const createAdminTestOrder = async (req, res) => {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
        return res.status(400).json({ message: "Valid amount is required for test" });
    }

    const order_id = "ADMIN_TEST_" + Date.now();

    const paymentData = {
        token: apiToken,
        order_id: order_id,
        txn_amount: amount,
        txn_note: "Admin System Health Check",
        product_name: "Admin Test",
        customer_name: "Admin_Tester",
        customer_mobile: "9999999999",
        customer_email: "admin@test.com",
        redirect_url: "https://colourtradingworld.sbs/admin-master"
    };

    try {
        const response = await axios.post('https://allapi.in/order/create', paymentData);
        // Return both the gateway response and the order_id for the next check
        res.json({
            ...response.data,
            test_order_id: order_id
        });
    } catch (err) {
        res.status(500).json({ 
            message: "3rd Party Gateway down or unreachable", 
            error: err.message 
        });
    }
};

// 2nd API: Check status specifically for these admin tests
export const checkAdminOrderStatus = async (req, res) => {
    const { order_id } = req.body;

    if (!order_id) {
        return res.status(400).json({ message: "Order ID required" });
    }

    try {
        const response = await axios.post('https://allapi.in/order/status', {
            token: apiToken,
            order_id: order_id
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Error checking status", error: err.message });
    }
};