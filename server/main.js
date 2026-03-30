require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { toNodeHandler } = require("better-auth/node");
const auth = require("./src/configs/auth");
const startReminderJob = require('./src/jobs/reminderJob');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const plannerRoutes = require('./src/routes/plannerRoutes');
const attendeeRoutes = require('./src/routes/attendeeRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Optimization Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(compression()); // Compress all responses
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Rate limiting to prevent Brute Force/DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  skip: (req) => req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1',
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/tickets', express.static(path.join(__dirname, 'public/tickets')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API Routes
app.use('/api/auth', authRoutes); // Manual Auth routes (Login/Register)
app.use('/api/auth', toNodeHandler(auth)); // Better-Auth Handles all /api/auth/* routes internally
app.use('/api/admin', adminRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/attendee', attendeeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Smart Event-Ticketing API is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: err.message
  });
});

// Start Background Jobs
startReminderJob();

app.listen(PORT, () => {
  console.log(`
 Server running on http://localhost:${PORT}
 Health check: http://localhost:${PORT}/health
 Scheduled jobs initialized
 `);
});
