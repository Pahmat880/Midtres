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
        console.log('Request Body:', req.body); // Log isi body yang diterima

        if (!req.body || Object.keys(req.body).length === 0) {
            console.error('Webhook payload is empty or undefined.');
            return res.status(400).send('Bad Request: Empty payload');
        }

        const statusResponse = await core.notifications.handle(req.body);
        
        console.log('Webhook berhasil diproses.');
        console.log('Status Response:', statusResponse);
        
        res.status(200).send('OK');

    } catch (e) {
        console.error('Error saat memproses notifikasi:', e.message);
        console.error('Stack Trace:', e.stack); // Tambahkan stack trace untuk detail lebih lanjut
        res.status(500).send('Internal Server Error');
    }
}
