import { pool } from '../../config/database.js';

export const transactionsRepository = {

    // Get all transactions for a user
    async getTransactionsByUserId(userId) {
        const result = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC',
            [userId]
        );
        return result.rows;
    },

    // Get transactions for a specific account
    async getTransactionsByAccountId(accountId, userId) {
        const result = await pool.query(
            'SELECT * FROM transactions WHERE account_id = $1 AND user_id = $2 ORDER BY transaction_date DESC',
            [accountId, userId]
        );
        return result.rows;
    },

    // Get transaction by ID with authorization
    async getTransactionByIdAndUserId(transactionId, userId) {
        const result = await pool.query(
            'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
            [transactionId, userId]
        );
        return result.rows[0];
    },

    // Get transactions within a date range
    async getTransactionsByDateRange(userId, startDate, endDate) {
        const result = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1 AND transaction_date BETWEEN $2 AND $3 ORDER BY transaction_date DESC',
            [userId, startDate, endDate]
        );
        return result.rows;
    },

    // Get transactions by category
    async getTransactionsByCategory(userId, category) {
        const result = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1 AND category = $2 ORDER BY transaction_date DESC',
            [userId, category]
        );
        return result.rows;
    },

    // Get transactions by type (income, expense, transfer)
    async getTransactionsByType(userId, transactionType) {
        const result = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1 AND transaction_type = $2 ORDER BY transaction_date DESC',
            [userId, transactionType]
        );
        return result.rows;
    },

    // Create new transaction
    async createTransaction(userId, accountId, { transaction_type, category, amount, description, transaction_date }) {
        const result = await pool.query(
            `INSERT INTO transactions (user_id, account_id, transaction_type, category, amount, description, transaction_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, user_id, account_id, transaction_type, category, amount, description, transaction_date, created_at, updated_at`,
            [userId, accountId, transaction_type, category, amount, description, transaction_date]
        );
        return result.rows[0];
    },

    // Update transaction
    async updateTransaction(transactionId, { transaction_type, category, amount, description, transaction_date }) {
        const result = await pool.query(
            `UPDATE transactions 
            SET transaction_type = $1, category = $2, amount = $3, description = $4, transaction_date = $5, updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING id, user_id, account_id, transaction_type, category, amount, description, transaction_date, created_at, updated_at`,
            [transaction_type, category, amount, description, transaction_date, transactionId]
        );
        return result.rows[0];
    },

    // Delete transaction
    async deleteTransaction(transactionId) {
        const result = await pool.query(
            'DELETE FROM transactions WHERE id = $1 RETURNING id',
            [transactionId]
        );
        return result.rows[0];
    },

    // Get transaction summary by category for a user
    async getTransactionSummaryByCategory(userId, startDate, endDate) {
        const result = await pool.query(
            `SELECT category, transaction_type, SUM(amount) as total, COUNT(*) as count
            FROM transactions 
            WHERE user_id = $1 AND transaction_date BETWEEN $2 AND $3
            GROUP BY category, transaction_type`,
            [userId, startDate, endDate]
        );
        return result.rows;
    }
};