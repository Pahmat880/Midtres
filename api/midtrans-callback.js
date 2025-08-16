// api/midtrans-callback.js

const midtransClient = require('midtrans-client');
require('dotenv').config();

// Konfigurasi Midtrans
const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        const statusResponse = await snap.notifications.handle(req.body);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        
        console.log(`Webhook diterima untuk Order ID: ${orderId}, Status: ${transactionStatus}`);
        
        // Di sini Anda bisa menambahkan logika untuk memperbarui status pesanan di database Anda
        // Contoh:
        // if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
        //   console.log('Pembayaran berhasil!');
        //   // Logika untuk mengirim notifikasi ke frontend atau memperbarui database
        // } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
        //   console.log('Pembayaran gagal atau kedaluwarsa.');
        // }
        
        res.status(200).send('OK');

    } catch (e) {
        console.error('Error saat memproses notifikasi:', e.message);
        res.status(500).send('Error');
    }
}
