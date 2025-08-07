const pool = require('../config/db');

const supplierController = {
  // Get all suppliers
  getAllSuppliers: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM supplier ORDER BY nama_supplier ASC');
      res.json(rows);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  },

  // Search suppliers
  searchSuppliers: async (req, res) => {
    const { query } = req.query;
    try {
      const [rows] = await pool.query(
        'SELECT * FROM supplier WHERE nama_supplier LIKE ? OR kontak_person LIKE ? ORDER BY nama_supplier ASC',
        [`%${query}%`, `%${query}%`]
      );
      res.json(rows);
    } catch (err) {
      console.error('Error searching suppliers:', err);
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  },

  // Get single supplier
  getSupplierById: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query('SELECT * FROM supplier WHERE id_supplier = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Supplier not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error fetching supplier:', err);
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  },

  // Create new supplier
// Create new supplier - diperbaiki tanpa catatan
createSupplier: async (req, res) => {
  const { nama_supplier, alamat, telepon, email, kontak_person } = req.body;

  if (!nama_supplier) {
    return res.status(400).json({ message: 'Nama supplier is required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO supplier (nama_supplier, alamat, telepon, email, kontak_person) VALUES (?, ?, ?, ?, ?)',
      [nama_supplier, alamat || null, telepon || null, email || null, kontak_person || null]
    );

    const [newSupplier] = await pool.query('SELECT * FROM supplier WHERE id_supplier = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      data: newSupplier[0],
      message: 'Supplier berhasil dibuat'
    });
  } catch (err) {
    console.error('Error creating supplier:', err);
    res.status(500).json({
      success: false,
      message: err.code === 'ER_DUP_ENTRY'
        ? 'Supplier dengan nama ini sudah ada'
        : 'Gagal membuat supplier'
    });
  }
},

// Update supplier - diperbaiki tanpa catatan
updateSupplier: async (req, res) => {
  const { id } = req.params;
  const { nama_supplier, alamat, telepon, email, kontak_person } = req.body;

  if (!nama_supplier) {
    return res.status(400).json({ message: 'Nama supplier is required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE supplier SET nama_supplier = ?, alamat = ?, telepon = ?, email = ?, kontak_person = ? WHERE id_supplier = ?',
      [nama_supplier, alamat || null, telepon || null, email || null, kontak_person || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Supplier tidak ditemukan'
      });
    }

    const [updatedSupplier] = await pool.query('SELECT * FROM supplier WHERE id_supplier = ?', [id]);

    res.json({
      success: true,
      data: updatedSupplier[0],
      message: 'Supplier berhasil diperbarui'
    });
  } catch (err) {
    console.error('Error updating supplier:', err);
    res.status(500).json({
      success: false,
      message: err.code === 'ER_DUP_ENTRY'
        ? 'Supplier dengan nama ini sudah ada'
        : 'Gagal memperbarui supplier'
    });
  }
},

searchSuppliers: async (req, res) => {
  const query = req.query.query || '';
  try {
    const [rows] = await pool.query(
      'SELECT * FROM supplier WHERE nama_supplier LIKE ? ORDER BY nama_supplier ASC',
      [`%${query}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error searching suppliers:', err);
    res.status(500).json({ message: 'Server error' });
  }
},

  // Delete supplier
// Delete supplier - diperbarui agar hapus juga data pembelian yang terkait
deleteSupplier: async (req, res) => {
  const { id } = req.params;
  try {
    // Hapus semua pembelian yang terkait supplier ini
    await pool.query('DELETE FROM pembelian WHERE id_supplier = ?', [id]);

    // Set supplier ke NULL pada produk jika masih ada relasi (optional)
    await pool.query('UPDATE produk SET id_supplier = NULL WHERE id_supplier = ?', [id]);

    // Hapus supplier
    const [result] = await pool.query('DELETE FROM supplier WHERE id_supplier = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    console.error('Error deleting supplier:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
}
};

module.exports = supplierController;