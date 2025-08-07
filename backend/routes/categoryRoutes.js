const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM kategori');
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new category
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Category name is required' 
      });
    }

    // Check if category already exists
    const [existing] = await pool.query(
      'SELECT id_kategori FROM kategori WHERE nama_kategori = ?', 
      [name]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Category already exists' 
      });
    }

    const [result] = await pool.query(
      'INSERT INTO kategori (nama_kategori, deskripsi) VALUES (?, ?)',
      [name, description || null]
    );

    const [newCategory] = await pool.query(
      'SELECT * FROM kategori WHERE id_kategori = ?',
      [result.insertId]
    );

    res.status(201).json({ 
      success: true, 
      data: newCategory[0] 
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    // Check if category exists
    const [existing] = await pool.query(
      'SELECT id_kategori FROM kategori WHERE id_kategori = ?', 
      [categoryId]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    // Check if new name is already used by another category
    if (name) {
      const [nameCheck] = await pool.query(
        'SELECT id_kategori FROM kategori WHERE nama_kategori = ? AND id_kategori != ?', 
        [name, categoryId]
      );
      
      if (nameCheck.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Category name already in use' 
        });
      }
    }

    await pool.query(
      'UPDATE kategori SET nama_kategori = ?, deskripsi = ? WHERE id_kategori = ?',
      [name || existing[0].nama_kategori, description || existing[0].deskripsi, categoryId]
    );

    const [updatedCategory] = await pool.query(
      'SELECT * FROM kategori WHERE id_kategori = ?',
      [categoryId]
    );

    res.json({ 
      success: true, 
      data: updatedCategory[0] 
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if category exists
    const [existing] = await pool.query(
      'SELECT id_kategori FROM kategori WHERE id_kategori = ?', 
      [categoryId]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    // Check if category is used by any products
    const [products] = await pool.query(
      'SELECT id_produk FROM produk WHERE id_kategori = ? LIMIT 1', 
      [categoryId]
    );
    
    if (products.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete category with associated products' 
      });
    }

    await pool.query('DELETE FROM kategori WHERE id_kategori = ?', [categoryId]);

    res.json({ 
      success: true, 
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;