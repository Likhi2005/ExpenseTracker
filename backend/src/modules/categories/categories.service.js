import { categoriesRepository } from './categories.repository.js';
import { ValidationError, AuthenticationError } from '../../utils/errors.js';

export const categoriesService = {

    // Get all categories for user
    async getAllCategories(userId) {
        if (!userId) {
            throw new AuthenticationError('User ID is required');
        }

        const categories = await categoriesRepository.getCategoriesByUserId(userId);
        return categories;
    },

    // Get categories by type (income/expense)
    async getCategoriesByType(userId, categoryType) {
        if (!userId || !categoryType) {
            throw new ValidationError('User ID and category type are required');
        }

        const validTypes = ['income', 'expense'];
        if (!validTypes.includes(categoryType)) {
            throw new ValidationError(`Invalid category type. Must be one of: ${validTypes.join(', ')}`);
        }

        const categories = await categoriesRepository.getCategoriesByType(userId, categoryType);
        return categories;
    },

    // Get category details
    async getCategoryDetails(categoryId, userId) {
        if (!categoryId || !userId) {
            throw new ValidationError('Category ID and User ID are required');
        }

        const category = await categoriesRepository.getCategoryByIdAndUserId(categoryId, userId);
        if (!category) {
            throw new AuthenticationError('Category not found or unauthorized');
        }

        return category;
    },

    // Create new category
    async createCategory(userId, categoryData) {
        if (!userId) {
            throw new AuthenticationError('User ID is required');
        }

        const { category_name, category_type } = categoryData;

        // Check if category already exists for user
        const existingCategory = await categoriesRepository.checkCategoryExists(userId, category_name, category_type);
        if (existingCategory) {
            throw new ValidationError(`${category_type.charAt(0).toUpperCase() + category_type.slice(1)} category "${category_name}" already exists`);
        }

        const category = await categoriesRepository.createCategory(userId, categoryData);
        return category;
    },

    // Update category
    async updateCategory(categoryId, userId, updateData) {
        if (!categoryId || !userId) {
            throw new ValidationError('Category ID and User ID are required');
        }

        // Verify category belongs to user
        const category = await categoriesRepository.getCategoryByIdAndUserId(categoryId, userId);
        if (!category) {
            throw new AuthenticationError('Category not found or unauthorized');
        }

        // Check if new category name already exists
        if (updateData.category_name && updateData.category_name !== category.category_name) {
            const existingCategory = await categoriesRepository.checkCategoryExists(
                userId,
                updateData.category_name,
                category.category_type
            );
            if (existingCategory) {
                throw new ValidationError(`Category "${updateData.category_name}" already exists`);
            }
        }

        const updatedCategory = await categoriesRepository.updateCategory(categoryId, updateData);
        return updatedCategory;
    },

    // Delete category
    async deleteCategory(categoryId, userId) {
        if (!categoryId || !userId) {
            throw new ValidationError('Category ID and User ID are required');
        }

        // Verify category belongs to user
        const category = await categoriesRepository.getCategoryByIdAndUserId(categoryId, userId);
        if (!category) {
            throw new AuthenticationError('Category not found or unauthorized');
        }

        await categoriesRepository.deleteCategory(categoryId);
        return { message: 'Category deleted successfully' };
    },

    // Get all category names for autocomplete
    async getCategoryNames(userId) {
        if (!userId) {
            throw new AuthenticationError('User ID is required');
        }

        const names = await categoriesRepository.getCategoryNames(userId);
        return names;
    },

    // Seed default categories for new user
    async seedDefaultCategories(userId) {
        if (!userId) {
            throw new AuthenticationError('User ID is required');
        }

        const categories = await categoriesRepository.getDefaultCategories(userId);
        return categories;
    }
};