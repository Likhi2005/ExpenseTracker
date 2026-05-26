import { categoriesService } from './categories.service.js';
import { sendResponse, sendError } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const categoriesController = {

    getAllCategories: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;

        const categories = await categoriesService.getAllCategories(userId);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Categories retrieved successfully',
            data: categories
        });
    }),

    getCategoriesByType: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { type } = req.query;

        const categories = await categoriesService.getCategoriesByType(userId, type);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} categories retrieved successfully`,
            data: categories
        });
    }),

    getCategoryDetails: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { id } = req.params;

        const category = await categoriesService.getCategoryDetails(parseInt(id), userId);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Category details retrieved successfully',
            data: category
        });
    }),

    createCategory: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;

        const category = await categoriesService.createCategory(userId, req.validated);

        sendResponse({
            res,
            statusCode: 201,
            success: true,
            message: 'Category created successfully',
            data: category
        });
    }),

    updateCategory: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { id } = req.params;

        const category = await categoriesService.updateCategory(parseInt(id), userId, req.validated);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    }),

    deleteCategory: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;
        const { id } = req.params;

        const result = await categoriesService.deleteCategory(parseInt(id), userId);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: result.message,
            data: result
        });
    }),

    getCategoryNames: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;

        const names = await categoriesService.getCategoryNames(userId);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Category names retrieved successfully',
            data: names
        });
    }),

    seedDefaultCategories: asyncHandler(async (req, res) => {
        const userId = req.user?.userId;

        const categories = await categoriesService.seedDefaultCategories(userId);

        sendResponse({
            res,
            statusCode: 201,
            success: true,
            message: 'Default categories created successfully',
            data: categories
        });
    })
};