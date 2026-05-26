import { pool } from '../../config/database.js';

export const categoriesRepository = {

    // Get all categories for a user
    async getCategoriesByUserId(userId) {
        const result = await pool.query(
            'SELECT * FROM categories WHERE user_id = $1 ORDER BY category_name ASC',
            [userId]
        );
        return result.rows;
    },

    // Get categories by type (income/expense) for a user
    async getCategoriesByType(userId, categoryType) {
        const result = await pool.query(
            'SELECT * FROM categories WHERE user_id = $1 AND category_type = $2 ORDER BY category_name ASC',
            [userId, categoryType]
        );
        return result.rows;
    },

    // Get category by ID with authorization
    async getCategoryByIdAndUserId(categoryId, userId) {
        const result = await pool.query(
            'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
            [categoryId, userId]
        );
        return result.rows[0];
    },

    // Check if category exists for user
    async checkCategoryExists(userId, categoryName, categoryType) {
        const result = await pool.query(
            'SELECT * FROM categories WHERE user_id = $1 AND category_name = $2 AND category_type = $3',
            [userId, categoryName, categoryType]
        );
        return result.rows[0];
    },

    // Create new category
    async createCategory(userId, { category_name, category_type, color_code = '#000000' }) {
        const result = await pool.query(
            `INSERT INTO categories (user_id, category_name, category_type, color_code)
            VALUES ($1, $2, $3, $4)
            RETURNING id, user_id, category_name, category_type, color_code, created_at, updated_at`,
            [userId, category_name, category_type, color_code]
        );
        return result.rows[0];
    },

    // Update category
    async updateCategory(categoryId, { category_name, color_code }) {
        const result = await pool.query(
            `UPDATE categories 
            SET category_name = COALESCE($1, category_name), 
                color_code = COALESCE($2, color_code), 
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING id, user_id, category_name, category_type, color_code, created_at, updated_at`,
            [category_name, color_code, categoryId]
        );
        return result.rows[0];
    },

    // Delete category
    async deleteCategory(categoryId) {
        const result = await pool.query(
            'DELETE FROM categories WHERE id = $1 RETURNING id',
            [categoryId]
        );
        return result.rows[0];
    },

    // Get category details by ID
    async getCategoryById(categoryId) {
        const result = await pool.query(
            'SELECT * FROM categories WHERE id = $1',
            [categoryId]
        );
        return result.rows[0];
    },

    // Get all category names for a user
    async getCategoryNames(userId) {
        const result = await pool.query(
            'SELECT DISTINCT category_name FROM categories WHERE user_id = $1 ORDER BY category_name ASC',
            [userId]
        );
        return result.rows.map(row => row.category_name);
    },

    // Get default categories (optional - for seeding)
    async getDefaultCategories(userId) {
        const defaultCategories = [
            { category_name: 'Salary', category_type: 'income', color_code: '#00C853' },
            { category_name: 'Bonus', category_type: 'income', color_code: '#00E676' },
            { category_name: 'Investment Returns', category_type: 'income', color_code: '#1DE9B6' },
            { category_name: 'Food & Dining', category_type: 'expense', color_code: '#FF6F00' },
            { category_name: 'Transportation', category_type: 'expense', color_code: '#2196F3' },
            { category_name: 'Shopping', category_type: 'expense', color_code: '#E91E63' },
            { category_name: 'Entertainment', category_type: 'expense', color_code: '#9C27B0' },
            { category_name: 'Utilities', category_type: 'expense', color_code: '#FF5722' },
            { category_name: 'Healthcare', category_type: 'expense', color_code: '#F44336' }
        ];

        const promises = defaultCategories.map(cat =>
            this.createCategory(userId, cat).catch(() => null)
        );

        const results = await Promise.all(promises);
        return results.filter(cat => cat !== null);
    }
};