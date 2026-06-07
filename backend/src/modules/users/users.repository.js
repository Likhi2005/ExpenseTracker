import { pool } from '../../config/database.js';

export const usersRepository = {

    // Find user by ID
    async findById(userId) {
        const result = await pool.query('SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL',
        [userId]
        );
        return result.rows[0];
    },

    // Update user
    async updateProfile(userId, data) {
        const setClauses = [];
        const values = [];
        let paramCount = 1;

        const allowedFields = ['name', 'email', 'password'];

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && allowedFields.includes(key)) {
                setClauses.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        values.push(userId);

        const query = `
        UPDATE users
        SET ${setClauses.join(", ")}, updated_at = NOW()
        WHERE id = $${ paramCount }
        RETURNING * `;

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Soft delete user
    async softDelete(userId) {
        const result = await pool.query('UPDATE users SET deleted_at = NOW() WHERE id = $1 RETURNING id', 
        [userId]
        );
        return result.rows[0];
    },
};