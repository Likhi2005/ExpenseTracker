import { pool } from '../../config/database.js';

export const authRepository = {

    // Find user by email
    async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]
        );
        return result.rows[0];
    },

    // Create new user
    async create(name, email, hashedPassword) {

        const result = await pool.query('INSERT INTO users (name, email, password) VALUES ( $1, $2, $3) RETURNING id, name, email, created_at',
            [name, email, hashedPassword]
        );
        return result.rows[0];
    },

    // Find user by ID
    async findById(userId) {

        const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1',
            [userId]
        );

        return result.rows[0];
    },
};