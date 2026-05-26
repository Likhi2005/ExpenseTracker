import { transactionsRepository } from './transactions.repository.js';
import { ValidationError, AuthenticationError } from '../../utils/errors.js';
import { accountsRepository } from '../accounts/accounts.repository.js';

export const transactionsService = {

    // Get all transactions for user
    async getAllTransactions(userId) {
        if (!userId) {
            throw new AuthenticationError('User ID is required');
        }

        const transactions = await transactionsRepository.getTransactionsByUserId(userId);
        return transactions;
    },

    // Get transactions by account
    async getTransactionsByAccount(accountId, userId) {
        if (!accountId || !userId) {
            throw new ValidationError('Account ID and User ID are required');
        }

        const transactions = await transactionsRepository.getTransactionsByAccountId(accountId, userId);
        return transactions;
    },

    // Get transaction details
    async getTransactionDetails(transactionId, userId) {
        if (!transactionId || !userId) {
            throw new ValidationError('Transaction ID and User ID are required');
        }

        const transaction = await transactionsRepository.getTransactionByIdAndUserId(transactionId, userId);
        if (!transaction) {
            throw new AuthenticationError('Transaction not found or unauthorized');
        }

        return transaction;
    },

    // Get transactions by date range
    async getTransactionsByDateRange(userId, startDate, endDate) {
        if (!userId || !startDate || !endDate) {
            throw new ValidationError('User ID, start date, and end date are required');
        }

        const transactions = await transactionsRepository.getTransactionsByDateRange(userId, startDate, endDate);
        return transactions;
    },

    // Get transactions by category
    async getTransactionsByCategory(userId, category) {
        if (!userId || !category) {
            throw new ValidationError('User ID and category are required');
        }

        const transactions = await transactionsRepository.getTransactionsByCategory(userId, category);
        return transactions;
    },

    // Get transactions by type
    async getTransactionsByType(userId, transactionType) {
        if (!userId || !transactionType) {
            throw new ValidationError('User ID and transaction type are required');
        }

        const validTypes = ['income', 'expense', 'transfer'];
        if (!validTypes.includes(transactionType)) {
            throw new ValidationError(`Invalid transaction type. Must be one of: ${validTypes.join(', ')}`);
        }

        const transactions = await transactionsRepository.getTransactionsByType(userId, transactionType);
        return transactions;
    },

    // Create new transaction
    async createTransaction(userId, accountId, transactionData) {
        if (!userId || !accountId) {
            throw new AuthenticationError('User ID and Account ID are required');
        }

        // IMPORTANT: Verify account belongs to user
        const account = await accountsRepository.getAccountByIdAndUserId(accountId, userId);
        if (!account) {
            throw new AuthenticationError('Account not found or does not belong to user');
        }

        // Validate transaction data
        const { transaction_type, category, amount, description, transaction_date } = transactionData;

        if (!transaction_type || !category || !amount || !transaction_date) {
            throw new ValidationError('Missing required transaction fields');
        }

        const transaction = await transactionsRepository.createTransaction(
            userId,
            accountId,
            transactionData
        );
        return transaction;
    },


    // Update transaction
    async updateTransaction(transactionId, userId, transactionData) {
        if (!transactionId || !userId) {
            throw new ValidationError('Transaction ID and User ID are required');
        }

        // Verify transaction belongs to user
        const transaction = await transactionsRepository.getTransactionByIdAndUserId(transactionId, userId);
        if (!transaction) {
            throw new AuthenticationError('Transaction not found or unauthorized');
        }

        const updatedTransaction = await transactionsRepository.updateTransaction(transactionId, transactionData);
        return updatedTransaction;
    },

    // Delete transaction
    async deleteTransaction(transactionId, userId) {
        if (!transactionId || !userId) {
            throw new ValidationError('Transaction ID and User ID are required');
        }

        // Verify transaction belongs to user
        const transaction = await transactionsRepository.getTransactionByIdAndUserId(transactionId, userId);
        if (!transaction) {
            throw new AuthenticationError('Transaction not found or unauthorized');
        }

        await transactionsRepository.deleteTransaction(transactionId);
        return { message: 'Transaction deleted successfully' };
    },

    // Get transaction summary by category
    async getTransactionSummary(userId, startDate, endDate) {
        if (!userId || !startDate || !endDate) {
            throw new ValidationError('User ID, start date, and end date are required');
        }

        const summary = await transactionsRepository.getTransactionSummaryByCategory(userId, startDate, endDate);
        return summary;
    }
};