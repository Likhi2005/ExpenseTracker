import { transactionsService } from '../modules/transactions/transactions.service.js';
import { transactionsRepository } from '../modules/transactions/transactions.repository.js';
import { ValidationError, AuthenticationError } from '../utils/errors.js';
import jest from 'jest-mock';

jest.mock('../modules/transactions/transactions.repository.js');

describe('Transactions Service', () => {
    const mockUserId = 1;
    const mockAccountId = 1;
    const mockTransactionId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllTransactions', () => {
        it('should retrieve all transactions for a user', async () => {
            const mockTransactions = [
                { id: 1, user_id: 1, account_id: 1, amount: 100, transaction_type: 'income' },
                { id: 2, user_id: 1, account_id: 1, amount: 50, transaction_type: 'expense' }
            ];

            transactionsRepository.getTransactionsByUserId.mockResolvedValue(mockTransactions);

            const result = await transactionsService.getAllTransactions(mockUserId);

            expect(result).toEqual(mockTransactions);
            expect(transactionsRepository.getTransactionsByUserId).toHaveBeenCalledWith(mockUserId);
        });

        it('should throw AuthenticationError if userId is missing', async () => {
            await expect(transactionsService.getAllTransactions(null))
                .rejects.toThrow(AuthenticationError);
        });
    });

    describe('getTransactionsByAccount', () => {
        it('should retrieve transactions for a specific account', async () => {
            const mockTransactions = [
                { id: 1, account_id: 1, amount: 100 }
            ];

            transactionsRepository.getTransactionsByAccountId.mockResolvedValue(mockTransactions);

            const result = await transactionsService.getTransactionsByAccount(mockAccountId, mockUserId);

            expect(result).toEqual(mockTransactions);
            expect(transactionsRepository.getTransactionsByAccountId).toHaveBeenCalledWith(mockAccountId, mockUserId);
        });
    });

    describe('createTransaction', () => {
        it('should create a new transaction', async () => {
            const transactionData = {
                transaction_type: 'expense',
                category: 'Food',
                amount: 50,
                description: 'Lunch',
                transaction_date: '2024-01-15'
            };

            const mockCreatedTransaction = { id: 1, user_id: 1, account_id: 1, ...transactionData };

            transactionsRepository.createTransaction.mockResolvedValue(mockCreatedTransaction);

            const result = await transactionsService.createTransaction(mockUserId, mockAccountId, transactionData);

            expect(result).toEqual(mockCreatedTransaction);
            expect(transactionsRepository.createTransaction).toHaveBeenCalledWith(
                mockUserId,
                mockAccountId,
                transactionData
            );
        });

        it('should throw AuthenticationError if userId is missing', async () => {
            const transactionData = {
                transaction_type: 'income',
                category: 'Salary',
                amount: 1000
            };

            await expect(transactionsService.createTransaction(null, mockAccountId, transactionData))
                .rejects.toThrow(AuthenticationError);
        });
    });

    describe('getTransactionsByDateRange', () => {
        it('should retrieve transactions within date range', async () => {
            const mockTransactions = [
                { id: 1, transaction_date: '2024-01-15', amount: 100 }
            ];

            transactionsRepository.getTransactionsByDateRange.mockResolvedValue(mockTransactions);

            const result = await transactionsService.getTransactionsByDateRange(
                mockUserId,
                '2024-01-01',
                '2024-01-31'
            );

            expect(result).toEqual(mockTransactions);
        });
    });

    describe('getTransactionsByCategory', () => {
        it('should retrieve transactions by category', async () => {
            const mockTransactions = [
                { id: 1, category: 'Food', amount: 50 }
            ];

            transactionsRepository.getTransactionsByCategory.mockResolvedValue(mockTransactions);

            const result = await transactionsService.getTransactionsByCategory(mockUserId, 'Food');

            expect(result).toEqual(mockTransactions);
        });
    });

    describe('getTransactionsByType', () => {
        it('should retrieve transactions by type', async () => {
            const mockTransactions = [
                { id: 1, transaction_type: 'expense', amount: 50 }
            ];

            transactionsRepository.getTransactionsByType.mockResolvedValue(mockTransactions);

            const result = await transactionsService.getTransactionsByType(mockUserId, 'expense');

            expect(result).toEqual(mockTransactions);
        });

        it('should throw ValidationError for invalid transaction type', async () => {
            await expect(transactionsService.getTransactionsByType(mockUserId, 'invalid'))
                .rejects.toThrow(ValidationError);
        });
    });

    describe('updateTransaction', () => {
        it('should update a transaction', async () => {
            const mockTransaction = { id: 1, user_id: 1, amount: 50 };
            const updateData = { amount: 75 };

            transactionsRepository.getTransactionByIdAndUserId.mockResolvedValue(mockTransaction);
            transactionsRepository.updateTransaction.mockResolvedValue({
                ...mockTransaction,
                ...updateData
            });

            const result = await transactionsService.updateTransaction(mockTransactionId, mockUserId, updateData);

            expect(result.amount).toBe(75);
        });

        it('should throw AuthenticationError if transaction not found', async () => {
            transactionsRepository.getTransactionByIdAndUserId.mockResolvedValue(null);

            await expect(transactionsService.updateTransaction(mockTransactionId, mockUserId, { amount: 75 }))
                .rejects.toThrow(AuthenticationError);
        });
    });

    describe('deleteTransaction', () => {
        it('should delete a transaction', async () => {
            const mockTransaction = { id: 1, user_id: 1 };

            transactionsRepository.getTransactionByIdAndUserId.mockResolvedValue(mockTransaction);
            transactionsRepository.deleteTransaction.mockResolvedValue({ id: 1 });

            const result = await transactionsService.deleteTransaction(mockTransactionId, mockUserId);

            expect(result.message).toBe('Transaction deleted successfully');
        });
    });

    describe('getTransactionSummary', () => {
        it('should retrieve transaction summary by category', async () => {
            const mockSummary = [
                { category: 'Food', transaction_type: 'expense', total: 200, count: 4 },
                { category: 'Salary', transaction_type: 'income', total: 3000, count: 1 }
            ];

            transactionsRepository.getTransactionSummaryByCategory.mockResolvedValue(mockSummary);

            const result = await transactionsService.getTransactionSummary(
                mockUserId,
                '2024-01-01',
                '2024-01-31'
            );

            expect(result).toEqual(mockSummary);
        });
    });
});