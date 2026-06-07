-- Add email verification columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);