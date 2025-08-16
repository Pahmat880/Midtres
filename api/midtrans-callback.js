// api/midtrans-callback.js

const midtransClient = require('midtrans-client');
require('dotenv').config();

// Gunakan CoreApi untuk menangani notifikasi dari Midtrans
const core = new midtransClient.CoreApi({
    isProduction: false, // Ubah ke true untuk mode Production
    serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        // Objek `core.notifications` yang memiliki metode `handle`
        const statusResponse = await core.notifications.handle(req.body);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        
        console.log(`Webhook diterima untuk Order ID: ${orderId}, Status: ${transactionStatus}`);
        
        // Di sini Anda bisa menambahkan logika untuk memperbarui status pesanan di database
        // if (transactionStatus == 'settlement' || transactionStatus == 'capture') {
        //   // Lakukan sesuatu ketika pembayaran berhasil
        // }
        
        res.status(200).send('OK');

    } catch (e) {
        console.error('Error saat memproses notifikasi:', e.message);
        res.status(500).send('Error');
    }
}
