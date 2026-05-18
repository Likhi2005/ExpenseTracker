import { pool } from '../../config/database.js';

export const accountsRepository = {

    // Retrieve all accounts for a specific user
    async getAccountsByUserId(userId) {
        const result = await pool.query('SELECT * FROM accounts WHERE user_id = $1', [userId]
        );
        return result.rows;
    },

    // Get single account by ID
    async getAccountById(accountId){
        const result = await pool.query(
            'SELECT * FROM accounts WHERE id = $1',
            [accountId]
        );
        return result.rows[0];
    },

    // Check if account exists for user
    async getAccountByIdAndUserId(accountId, userId){
        const result = await pool.query(
            'SELECT * FROM accounts WHERE id = $1 AND user_id = $2',
            [accountId, userId]
        );
        return result.rows[0];
    },

    // Check if account name already exists for user
    async checkAccountExists(userId, accountName){
        const result = await pool.query(
            'SELECT * FROM accounts WHERE user_id = $1 AND account_name = $2',
            [userId, accountName]
        );
        return result.rows[0];
    },

    // Create a new account for  a user
    async createAccount(userId, accountName, accountType, initialBalance = 0) {
        const result = await pool.query(
            `INSERT INTO accounts (user_id,account_name, accountType, balance)
            VALUES($1, $2, $3, $4)
            RETURNING id, user_id, account_name, accountType, balance`,
            [userId, accountName, accountType, initialBalance]
        );
        return result.rows[0];
    },

    // Update account balance
    async updateAccountBalance(accountId, newBalance) {
        const result = await pool.query(
            `UPDATE accounts set balance = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2 
            RETURNING id, user_id, account_name, accountType, balance, is_active, created_at, updated_at`,
            [newBalance, accountId]
        );
        return result.rows[0];
    },

    // Delete account
    async deleteAccount(accountId) {
        const result = await pool.query(
            'DELETE FROM accounts WHERE id = $1 RETURNING id',
            [accountId]
        );
        return result.rows[0];
    },

    // Deactivate account (soft delete)
    async deactivateAccount(accountId) {
        const result = await pool.query(
            `UPDATE accounts SET is_active = false, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING id, is_active`,
            [accountId]
        );
        return result.rows[0];
    }
}