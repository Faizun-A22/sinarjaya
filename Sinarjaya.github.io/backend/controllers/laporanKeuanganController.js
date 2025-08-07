const pool = require('../config/db');

// Ambil semua laporan keuangan dari database
exports.getAllReports = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id_laporan, bulan, tahun, pendapatan, pengeluaran, laba, catatan FROM laporan_keuangan ORDER BY tahun DESC, bulan DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching laporan keuangan:', err);
    res.status(500).json({ message: 'Gagal mengambil data laporan keuangan.' });
  }
};
