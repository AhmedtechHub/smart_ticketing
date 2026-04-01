const crypto = require('crypto');
const prisma = require('../configs/db');
const bookingService = require('../services/bookingService');

const paymentController = {
  paystackWebhook: async (req, res) => {
    try {
      // Validate hash
      const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex');
      
      if (hash !== req.headers['x-paystack-signature']) {
        return res.status(401).send('Invalid signature');
      }

      const event = req.body;
      if (event.event === 'charge.success') {
        const reference = event.data.reference;
        await bookingService.finalizeBooking(reference);
      }

      res.status(200).send('Webhook processed');
    } catch (error) {
      console.error('Paystack Webhook Error:', error);
      res.status(500).send('Webhook internal error');
    }
  },

  mpesaCallback: async (req, res) => {
    try {
      console.log("[DEBUG MPESA] Incoming Callback Body:", JSON.stringify(req.body, null, 2));
      const Body = req.body.Body || req.body;
      const { stkCallback } = Body;
      
      if (!stkCallback) {
        console.error("[DEBUG MPESA] Malformed Callback: stkCallback missing.");
        return res.status(400).json({ ResultCode: 1, ResultDesc: "Missing stkCallback" });
      }

      const resultCode = stkCallback.ResultCode;
      const checkoutRequestId = stkCallback.CheckoutRequestID;
      
      console.log(`[DEBUG MPESA] ID: ${checkoutRequestId}, Result: ${resultCode}`);
        
      if (resultCode === 0) {
        const booking = await prisma.booking.findUnique({
          where: { checkoutRequestId }
        });

        if (booking) {
          console.log(`[DEBUG MPESA] MATCH FOUND: Finalizing ${booking.reference}`);
          await bookingService.finalizeBooking(booking.reference);
        } else {
          console.warn(`[DEBUG MPESA] NO MATCH: CheckoutRequestID ${checkoutRequestId} not found in DB.`);
          // list all pending bookings with checkoutRequestIds for debugging
          const pending = await prisma.booking.findMany({ where: { status: 'PENDING' }, select: { checkoutRequestId: true, reference: true } });
          console.log("[DEBUG MPESA] Currently Pending in DB:", pending);
        }
      } else {
        console.warn(`[DEBUG MPESA] STK Push Failed by User/Safaricom: ${stkCallback.ResultDesc}`);
      }

      res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
    } catch (error) {
      console.error('[DEBUG MPESA] Callback Crash:', error);
      res.status(500).json({ ResultCode: 1, ResultDesc: "Internal Error" });
    }
  }
};

module.exports = paymentController;
