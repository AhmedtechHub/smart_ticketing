const axios = require('axios');

// Paystack Config
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const paystackApi = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET}`,
    'Content-Type': 'application/json',
  },
});

// M-Pesa Config
const MPESA_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_BASE_URL = process.env.MPESA_BASE_URL;

let cachedToken = null;
let tokenExpiry = null;

const getMpesaToken = async () => {
  try {
    const now = new Date();
    if (cachedToken && tokenExpiry && now < tokenExpiry) {
        return cachedToken;
    }

    const auth = Buffer.from(`${MPESA_KEY}:${MPESA_SECRET}`).toString('base64');
    const response = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
    });

    cachedToken = response.data.access_token;
    tokenExpiry = new Date(now.getTime() + (Number(response.data.expires_in) * 1000) - 60000); // 1 minute buffer
    return cachedToken;
  } catch (error) {
    console.error("M-Pesa Token Generation Error:", error.response?.data || error.message);
    throw error;
  }
};

const paymentService = {
  // Paystack: Initialize Transaction
  initializePaystack: async (email, amount, metadata) => {
    const response = await paystackApi.post('/transaction/initialize', {
      email,
      amount: amount * 100, // Paystack expects amount in kobo/cents
      metadata,
    });
    return response.data.data;
  },

  // Paystack: Verify Transaction
  verifyPaystack: async (reference) => {
    const response = await paystackApi.get(`/transaction/verify/${reference}`);
    return response.data.data;
  },

  // M-Pesa: STK Push
  initiateMpesaStkPush: async (phone, amount, reference) => {
    try {
      const token = await getMpesaToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const password = Buffer.from(`${MPESA_SHORTCODE}${process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'}${timestamp}`).toString('base64');
  
      const response = await axios.post(
        `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phone,
          PartyB: MPESA_SHORTCODE,
          PhoneNumber: phone,
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: reference,
          TransactionDesc: 'Event Booking',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("M-Pesa STK Push Error:", error.response?.data || error.message);
      throw error;
    }
  },
};

module.exports = paymentService;
