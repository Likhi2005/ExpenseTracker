import crypto from 'crypto'

export const generateVerificationToken = () => {

    // Genearte random token (URL safe)
    const randomPart = crypto.randomBytes(32).toString('hex');
    const token = `${randomPart}`;

    // Hash the token before storing in DB for security
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    return { token, hashedToken };
}

export const hashToken = (token) => {
    return crypto.createHash('sha256')
        .update(token)
        .digest('hex');
}

export const isTokenExpired = (expiredAt) => {
    return new Date() > new Date(expiredAt);
}

export const calculateExpiryToken = (hours=24) => {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
}