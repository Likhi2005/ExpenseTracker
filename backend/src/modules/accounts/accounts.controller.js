import { accountsService } from './accounts.service.js';
import { sendResponse, sendError } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const accountsController = {

    getAllAccounts: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;

        const accounts = await accountsService.getAllAccounts(userId);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: "Accounts retrieved successfully",
            data: accounts
        });
    }),

    createAccount: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;

        const account = await accountsService.createAccount(userId, req.validated);

        sendResponse({
            res,
            statusCode: 201,
            success: true,
            message: "Account created successfully",
            data: account
        });
    }),

    getAccountDetails: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { id } = req.params;

        const account = await accountsService.getAccountDetails(parseInt(id), userId);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: "Account details retrieved successfully",
            data: account
        });
    }),

    addMoney: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { id } = req.params;

        const account = await accountsService.addMoneyToAccount(parseInt(id), userId, req.validated.amount);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: "Money added successfully",
            data: account
        });
    }),

    withdrawMoney: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { id } = req.params;

        const account = await accountsService.withdrawMoneyFromAccount(parseInt(id), userId, req.validated.amount);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: "Money withdrawn successfully",
            data: account
        });
    }),

    transferMoney: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;

        const result = await accountsService.transferMoney(userId, req.validated);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: "Money transferred successfully",
            data: result
        });
    }),

    deleteAccount: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { id } = req.params;

        const result = await accountsService.deleteAccount(parseInt(id), userId);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: "Account deleted successfully",
            data: result
        });
    }),
};