// qrCode.js
import express from 'express';
import QRCode from 'qrcode';

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL; // Replace with your real frontend link

// GET /api/qr/:userId/:eventId
router.get('/qr/:userId/:eventId', async (req, res) => {
  const { userId, eventId } = req.params;

  const qrLink = `${FRONTEND_URL}?userId=${userId}&eventId=${eventId}`;

  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrLink);

    res.status(200).json({
      qrLink, // Optional: include the link encoded in the QR
      qrCodeBase64: qrCodeDataURL, // You can display this in <img src="..." />
    });
  } catch (err) {
    console.error('QR generation failed:', err);
    res.status(500).json({ message: 'QR generation failed' });
  }
});

export default router;
