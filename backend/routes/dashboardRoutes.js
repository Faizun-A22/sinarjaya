const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Dashboard summary data
router.get('/summary', dashboardController.getSummaryData);

// Sales chart data (last 6 months)
router.get('/sales-chart', dashboardController.getSalesChartData);

// Inventory distribution chart
router.get('/inventory-chart', dashboardController.getInventoryChartData);

// Recent transactions (last 10)
router.get('/recent-transactions', dashboardController.getRecentTransactions);

// Low stock items
router.get('/low-stock', dashboardController.getLowStockItems);

module.exports = router;