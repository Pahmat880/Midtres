// api/midtrans-callback.js

const midtransClient = require('midtrans-client');
require('dotenv').config();

const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    try {
        console.log('--- Menerima Webhook ---');
        console.log('Request Body:', req.body);

        if (!req.body || Object.keys(req.body).length === 0) {
            console.error('Webhook payload is empty or undefined.');
            return res.status(400).send('Bad Request: Empty payload');
        }

        const statusResponse = await core.notifications.handle(req.body);
        
        console.log('Webhook berhasil diproses.');
        console.log('Status Transaksi:', statusResponse.transaction_status);
        
        // --- Perbaikan di sini ---
        // Midtrans mengharapkan respons status 200 dengan body "OK"
        res.status(200).send('OK');

    } catch (e) {
        console.error('Kesalahan saat memproses notifikasi:', e.message);
        console.error('Stack Trace:', e.stack);
        // Kirim respons 500 jika ada error
        res.status(500).send('Internal Server Error');
    }
}
