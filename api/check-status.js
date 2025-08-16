// api/check-status.js

const midtransClient = require('midtrans-client');
require('dotenv').config();

const core = new midtransClient.CoreApi({
    isProduction : false,
    serverKey : process.env.MIDTRANS_SERVER_KEY,
});

export default async function handler(req, res) {
    const { orderId } = req.query; // Ambil orderId dari query parameter

    if (!orderId) {
        return res.status(400).json({ message: 'Order ID is required' });
    }

    try {
        const statusResponse = await core.transaction.status(orderId);
        res.status(200).json(statusResponse);
        
    } catch (error) {
        console.error("Error saat cek status:", error.message);
        res.status(500).json({ message: "Failed to check status" });
    }
}
