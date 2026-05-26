import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import { accountsController } from './accounts.controller.js';
import {
    createAccountSchema,
    addMoneySchema,
    transferSchema
} from '../../validators/accounts.validation.js';

const router = express.Router();

// Get all accounts
router.get('/', authMiddleware, accountsController.getAllAccounts);

// Create account
router.post('/', authMiddleware, validate(createAccountSchema), accountsController.createAccount);

// Get account details
router.get('/:id', authMiddleware, accountsController.getAccountDetails);

// Add money to account
router.put('/:id/add-money', authMiddleware, validate(addMoneySchema), accountsController.addMoney);

// Withdraw money from account
router.put('/:id/withdraw', authMiddleware, validate(addMoneySchema), accountsController.withdrawMoney);

// Transfer money between accounts
router.post('/transfer', authMiddleware, validate(transferSchema), accountsController.transferMoney);

// Delete account
router.delete('/:id', authMiddleware, accountsController.deleteAccount);

export default router;