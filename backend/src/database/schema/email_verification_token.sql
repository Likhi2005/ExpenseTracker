-- AlterTable
ALTER TABLE users ADD COLUMN (
    email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT true,
)

-- CreateTable
CREATE TABLE IF NOT EXISTS email_verification_token (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    token_hash VARCHAR(255) NOT NULL,
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
);

CREATE INDEX IF NOT EXISTS idx_user_id ON email_verification_token(user_id);
CREATE INDEX IF NOT EXISTS idx_token_hash ON email_verification_token(token_hash);