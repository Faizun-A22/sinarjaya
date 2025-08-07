const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// Get all purchases with filters
router.get('/', purchaseController.getAllPurchases);

// Get purchase summary
router.get('/summary', purchaseController.getPurchaseSummary);

// Get suppliers list
router.get('/suppliers/list', purchaseController.getSuppliersList);

// Get products list
router.get('/products/list', purchaseController.getProductsList);

// Get single purchase
router.get('/:id', purchaseController.getPurchaseById);

// Create new purchase
router.post('/', purchaseController.createPurchase);

// Update purchase
router.put('/:id', purchaseController.updatePurchase);

// Delete purchase
router.delete('/:id', purchaseController.deletePurchase);

module.exports = router;