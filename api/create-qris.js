// api/create-qris.js

const midtransClient = require('midtrans-client');
require('dotenv').config();

// Konfigurasi Midtrans
const core = new midtransClient.CoreApi({
    isProduction : false, // Ubah ke true untuk mode Production
    serverKey : process.env.MIDTRANS_SERVER_KEY,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { orderId, amount } = req.body;

        const parameter = {
            "payment_type": "qris",
            "transaction_details": {
                "order_id": orderId,
                "gross_amount": amount
            }
        };

        const response = await core.charge(parameter);
        res.status(200).json(response);

    } catch (error) {
        console.error("Error saat membuat transaksi:", error.message);
        res.status(500).json({ status_message: "Gagal membuat transaksi" });
    }
}