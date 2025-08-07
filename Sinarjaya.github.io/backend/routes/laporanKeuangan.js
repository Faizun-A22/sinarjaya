const express = require('express');
const router = express.Router();
const laporanKeuanganController = require('../controllers/laporanKeuanganController');

// GET semua laporan keuangan
router.get('/', laporanKeuanganController.getAllReports);

// Nanti bisa tambahkan: router.post('/', ...), router.put('/:id', ...), router.delete('/:id', ...)

module.exports = router;
