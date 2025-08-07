const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET semua produk
router.get('/', productController.getAllProducts);

// GET produk berdasarkan ID
router.get('/:id', productController.getProductById);

// POST produk baru
router.post('/', productController.createProduct);

// PUT (update) produk
router.put('/:id', productController.updateProduct);

// DELETE produk
router.delete('/:id', productController.deleteProduct);

module.exports = router;
