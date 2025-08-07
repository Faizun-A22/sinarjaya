const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// Get all suppliers
router.get('/', supplierController.getAllSuppliers);

// Search suppliers
router.get('/search', supplierController.searchSuppliers);

// Get single supplier
router.get('/:id', supplierController.getSupplierById);

// Create new supplier
router.post('/', supplierController.createSupplier);

// Update supplier
router.put('/:id', supplierController.updateSupplier);

// Delete supplier
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;