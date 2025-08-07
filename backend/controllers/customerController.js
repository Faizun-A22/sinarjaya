const pool = require('../config/db');

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pelanggan ORDER BY id_pelanggan DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add new customer
exports.createCustomer = async (req, res) => {
  const { nama_pelanggan, alamat, telepon, email, catatan } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO pelanggan (nama_pelanggan, alamat, telepon, email, catatan) VALUES (?, ?, ?, ?, ?)',
      [nama_pelanggan, alamat, telepon, email, catatan]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { nama_pelanggan, alamat, telepon, email, catatan } = req.body;
  try {
    await pool.query(
      'UPDATE pelanggan SET nama_pelanggan=?, alamat=?, telepon=?, email=?, catatan=? WHERE id_pelanggan=?',
      [nama_pelanggan, alamat, telepon, email, catatan, id]
    );
    res.json({ message: 'Customer updated' });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM pelanggan WHERE id_pelanggan=?', [id]);
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
