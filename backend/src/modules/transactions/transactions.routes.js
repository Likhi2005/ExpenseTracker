import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import { transactionsController } from './transactions.controller.js';
import {
    createTransactionSchema,
    updateTransactionSchema
} from '../../validators/transactions.validation.js';

const router = express.Router();

// Get all transactions for user
router.get('/', authMiddleware, transactionsController.getAllTransactions);

// Get transactions by date range
router.get('/filter/date-range', authMiddleware, transactionsController.getTransactionsByDateRange);

// Get transactions by category
router.get('/filter/category', authMiddleware, transactionsController.getTransactionsByCategory);

// Get transactions by type
router.get('/filter/type', authMiddleware, transactionsController.getTransactionsByType);

// Get transaction summary
router.get('/summary/report', authMiddleware, transactionsController.getTransactionSummary);

// Get transactions for specific account
router.get('/account/:accountId', authMiddleware, transactionsController.getTransactionsByAccount);

// Get transaction details
router.get('/:id', authMiddleware, transactionsController.getTransactionDetails);

// Create transaction
router.post('/account/:accountId', authMiddleware, validate(createTransactionSchema), transactionsController.createTransaction);

// Update transaction
router.put('/:id', authMiddleware, validate(updateTransactionSchema), transactionsController.updateTransaction);

// Delete transaction
router.delete('/:id', authMiddleware, transactionsController.deleteTransaction);

export default router;