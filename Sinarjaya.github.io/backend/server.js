// server.js
const express = require('express');
const path = require('path');
const ngrok = require('ngrok');
const app = express();
const PORT = process.env.PORT || 3000;

// Dapatkan path absolut ke folder frontend (sibling dari backend)
const frontendPath = path.join(__dirname, '..', 'frontend');

// Middleware untuk file statis dari folder frontend
app.use(express.static(frontendPath));

// Route untuk landing page utama
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'landingPage.html'));
});

// Route untuk login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
});

// Endpoint API contoh untuk form kontak
app.post('/api/contact', express.json(), express.urlencoded({ extended: true }), (req, res) => {
    console.log('Data kontak diterima:', req.body);
    // Simpan ke database atau kirim email di sini
    res.json({ success: true, message: 'Pesan terkirim!' });
});

// Start server
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Frontend path: ${frontendPath}`); // Debug path
    
    try {
        // Membuka tunnel Ngrok
        const url = await ngrok.connect({
            proto: 'http',
            addr: PORT,
            region: 'ap' // Asia Pacific region
        });
        
        console.log(`Ngrok tunnel opened at: ${url}`);
        console.log('Landing page:', `${url}`);
        console.log('Login page:', `${url}/login`);
        
    } catch (err) {
        console.error('Error opening Ngrok tunnel:', err);
    }
});