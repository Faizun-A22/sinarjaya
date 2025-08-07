const express = require('express');
const cors = require('cors');
const path = require('path');
const ngrok = require('ngrok');
require('dotenv').config();
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const laporanKeuanganRoutes = require('./routes/laporanKeuangan');
const transaksiRoutes = require('./routes/transaksiRoutes'); 
const purchaseRoutes = require('./routes/purchaseRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '../frontend')));
// Middleware
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000','https://06cc0fc85c35.ngrok-free.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
// Serve static files from frontend
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend path: ${frontendPath}`);
    // Jalankan ngrok
    try {
        const url = await ngrok.connect(PORT);
        console.log(`🔗 Ngrok tunnel opened at: ${url}`);
        console.log(`🌐 Landing page: ${url}`);
        console.log(`🔐 Login page: ${url}/login`);
    } catch (err) {
        console.error('❌ Failed to start ngrok:', err);
    }
});
// Routes
app.use('/api/purchases', purchaseRoutes); 
app.use('/api/laporan-keuangan', laporanKeuanganRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes);

// Frontend routes
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'landingPage.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(frontendPath, 'login.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
