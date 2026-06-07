import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import { categoriesController } from './categories.controller.js';
import {
    createCategorySchema,
    updateCategorySchema
} from '../../validators/categories.validation.js';

const router = express.Router();

// Get all categories
router.get('/', authMiddleware, categoriesController.getAllCategories);

// Get categories by type (income/expense)
router.get('/filter/type', authMiddleware, categoriesController.getCategoriesByType);

// Get all category names (for autocomplete)
router.get('/names/list', authMiddleware, categoriesController.getCategoryNames);

// Seed default categories for new user
router.post('/seed/defaults', authMiddleware, categoriesController.seedDefaultCategories);

// Get category details
router.get('/:id', authMiddleware, categoriesController.getCategoryDetails);

// Create category
router.post('/', authMiddleware, validate(createCategorySchema), categoriesController.createCategory);

// Update category
router.put('/:id', authMiddleware, validate(updateCategorySchema), categoriesController.updateCategory);

// Delete category
router.delete('/:id', authMiddleware, categoriesController.deleteCategory);

export default router;