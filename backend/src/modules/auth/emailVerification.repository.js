import { pool } from '../../config/database.js';

export const emailVerificationRepository = {

    // Find user by token hash
    async findByToken(userId, tokenHash) {
        const result = await pool.query('SELECT id, user_id, token_hash, is_used, created_at, updated_at, expires_at FROM email_verification_token WHERE user_id =$1 AND token_hash = $2 AND is_used = false AND expires_at > NOW()',
            [userId, tokenHash]
        );
        return result.rows[0];
    },

    // Create new email verification token
    async create(userId, tokenHash, expiresAt) {
        const result = await pool.query('INSERT INTO email_verification_token(user_id, token_hash, expires_at) VALUES ($1, $2, $3) RETURNING id, user_id, token_hash, is_used, created_at, updated_at, expires_at',
            [userId, tokenHash, expiresAt]
        );
        return result.rows[0];
    },

    // Mark token as used
    async markTokenAsUsed(tokenId) {
        const client = await pool.connect();
        try{
            await client.query('BEGIN');

            const tokenResult = await client.query('UPDATE email_verification_token SET is_used = true WHERE id = $1 RETURNING id, user_id, token_hash, is_used, created_at, updated_at, expires_at',
                [tokenId]
            );

            const updatedToken = tokenResult.rows[0];

            const userResult = await client.query('UPDATE users SET email_verified = true, email_verified_at = NOW() WHERE id = $1 RETURNING id, name, email, email_verified, email_verified_at',
                [updatedToken.user_id]
            );

            await client.query('COMMIT');

            return userResult.rows[0];
        }catch(err){
            await client.query('ROLLBACK');
            throw err;
        }finally{
            await client.release();
        }
    },

    // Invalidate token (mark as used without verifying email)
    async invalidateOldTokens(userId) {
        await pool.query('UPDATE email_verification_token SET is_used = true WHERE user_id = $1 AND is_used = false', [userId]);
    }
}