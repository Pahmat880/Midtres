// api/midtrans-callback.js

const midtransClient = require('midtrans-client');
require('dotenv').config();

// Konfigurasi Midtrans
const core = new midtransClient.CoreApi({
    isProduction: false, // Ubah ke true untuk Production
    serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        // Gunakan objek `core` untuk menangani notifikasi
        const statusResponse = await core.notifications.handle(req.body);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        
        console.log(`Webhook diterima untuk Order ID: ${orderId}, Status: ${transactionStatus}`);
        
        // Di sini Anda bisa menambahkan logika untuk memperbarui status pesanan di database Anda
        // Contoh:
        // if (transactionStatus == 'settlement' || transactionStatus == 'capture') {
        //   console.log('Pembayaran berhasil!');
        // }
        
        res.status(200).send('OK');

    } catch (e) {
        console.error('Error saat memproses notifikasi:', e.message);
        res.status(500).send('Error');
    }
}
