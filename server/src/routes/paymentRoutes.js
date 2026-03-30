const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Webhooks don't usually use standard auth but secret validation
router.post('/paystack/webhook', paymentController.paystackWebhook);
router.post('/mpesa/callback', paymentController.mpesaCallback);

module.exports = router;
