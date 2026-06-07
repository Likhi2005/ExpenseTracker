import { transactionsService } from './transactions.service.js';
import { sendResponse, sendError } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const transactionsController = {

    getAllTransactions: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;

        const transactions = await transactionsService.getAllTransactions(userId);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Transactions retrieved successfully',
            data: transactions
        });
    }),

    getTransactionsByAccount: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { accountId } = req.params;

        const transactions = await transactionsService.getTransactionsByAccount(parseInt(accountId), userId);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Account transactions retrieved successfully',
            data: transactions
        });
    }),

    getTransactionDetails: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { id } = req.params;

        const transaction = await transactionsService.getTransactionDetails(parseInt(id), userId);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Transaction details retrieved successfully',
            data: transaction
        });
    }),

    getTransactionsByDateRange: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { startDate, endDate } = req.query;

        const transactions = await transactionsService.getTransactionsByDateRange(userId, startDate, endDate);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Transactions retrieved successfully',
            data: transactions
        });
    }),

    getTransactionsByCategory: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { category } = req.query;

        const transactions = await transactionsService.getTransactionsByCategory(userId, category);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Transactions retrieved successfully',
            data: transactions
        });
    }),

    getTransactionsByType: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { type } = req.query;

        const transactions = await transactionsService.getTransactionsByType(userId, type);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Transactions retrieved successfully',
            data: transactions
        });
    }),

    createTransaction: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { accountId } = req.params;

        const transaction = await transactionsService.createTransaction(
            userId,
            parseInt(accountId),
            req.validated
        );

        sendResponse({
            res,
            statusCode: 201,
            success: true,
            message: 'Transaction created successfully',
            data: transaction
        });
    }),

    updateTransaction: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { id } = req.params;

        const transaction = await transactionsService.updateTransaction(parseInt(id), userId, req.validated);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Transaction updated successfully',
            data: transaction
        });
    }),

    deleteTransaction: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { id } = req.params;

        const result = await transactionsService.deleteTransaction(parseInt(id), userId);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: result.message,
            data: result
        });
    }),

    getTransactionSummary: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { startDate, endDate } = req.query;

        const summary = await transactionsService.getTransactionSummary(userId, startDate, endDate);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Transaction summary retrieved successfully',
            data: summary
        });
    })
};