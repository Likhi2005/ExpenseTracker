import express from 'express';
import authRoutes from './auth/auth.routes.js';
import usersRoutes from './users/users.routes.js';
import accountRoutes from './accounts/accounts.routes.js';
import transactionRoutes from './transactions/transactions.routes.js';
import categoriesRoutes from './categories/categories.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/accounts',accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/categories', categoriesRoutes);

export default router;