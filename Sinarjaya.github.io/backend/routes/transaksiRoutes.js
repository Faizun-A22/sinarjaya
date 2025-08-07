const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

// Get all transactions with filters
router.get('/', transaksiController.getAllTransactions);

// Get transaction by ID
router.get('/:id', transaksiController.getTransactionById);

// Create new transaction
router.post('/', transaksiController.createTransaction);

// Update transaction
router.put('/:id', transaksiController.updateTransaction);

// Delete transaction
router.delete('/:id', transaksiController.deleteTransaction);

// Get customers for dropdown
router.get('/customers/list', transaksiController.getCustomers);

// Get products for dropdown
router.get('/products/list', transaksiController.getProducts);

module.exports = router;