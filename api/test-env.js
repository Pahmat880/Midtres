// api/test-env.js

export default async function handler(req, res) {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (serverKey) {
        return res.status(200).send(`Server Key berhasil terbaca. Nilainya: ${serverKey}`);
    } else {
        return res.status(500).send('Error: Server Key tidak terbaca. Pastikan sudah diatur di Vercel.');
    }
}
