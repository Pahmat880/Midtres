const midtransClient = require('midtrans-client');
require('dotenv').config();

// Konfigurasi Midtrans
const core = new midtransClient.CoreApi({
    isProduction : false, // Ubah ke true untuk mode Production
    serverKey : process.env.MIDTRANS_SERVER_KEY,
    clientKey : '' // Tidak digunakan untuk server-side
});

export default async function handler(req, res) {
    // Pastikan metode permintaan adalah POST
    if (req.method !== 'POST') {
        // Jika bukan POST, kembalikan status 405 (Method Not Allowed)
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Ambil data orderId dan amount dari body permintaan
        const { orderId, amount } = req.body;

        // Buat parameter transaksi untuk QRIS
        const parameter = {
            "payment_type": "qris",
            "transaction_details": {
                "order_id": orderId,
                "gross_amount": amount
            }
        };

        // Panggil API Midtrans untuk membuat transaksi
        const response = await core.charge(parameter);

        // Kembalikan seluruh objek respons Midtrans ke frontend
        res.status(200).json(response);

    } catch (error) {
        // Tangani kesalahan jika ada
        console.error("Error saat membuat transaksi:", error.message);
        res.status(500).json({ status_message: "Gagal membuat transaksi" });
    }
}
