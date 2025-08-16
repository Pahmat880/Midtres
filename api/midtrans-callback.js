const midtransClient = require('midtrans-client');
require('dotenv').config();

const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        console.error('Metode HTTP tidak diizinkan. Gunakan POST.');
        return res.status(405).send('Method Not Allowed');
    }

    try {
        console.log('--- Menerima Webhook ---');
        console.log('Request Body:', req.body);

        if (!req.body || Object.keys(req.body).length === 0) {
            console.error('Payload webhook kosong.');
            return res.status(400).send('Bad Request: Empty payload');
        }

        const statusResponse = await core.notifications.handle(req.body);
        
        console.log('Webhook berhasil diproses.');
        console.log('Status Transaksi:', statusResponse.transaction_status);
        
        res.status(200).send('OK');

    } catch (e) {
        // Log pesan kesalahan yang sangat detail
        console.error('Kesalahan saat memproses notifikasi: ', e.message);
        console.error('Tipe Error: ', e.name);
        console.error('Data Lengkap Error: ', e);

        // Jika error berasal dari Midtrans, tampilkan pesannya
        if (e.ApiResponse) {
            console.error('Pesan dari Midtrans:', e.ApiResponse.status_message);
        }

        res.status(500).send('Internal Server Error');
    }
}
