import { emailVerificationRepository } from './emailVerification.repository.js';
import { authRepository } from './auth.repository.js';
import { generateVerificationToken, hashToken, isTokenExpired, calculateTokenExpiry } from '../../utils/tokenGenerator.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../../services/email/email.service.js';

export const emailVerificationService = {

    async sendVerification(user) {
        const { token, hashedToken } = generateVerificationToken();
        const expiresAt = calculateTokenExpiry(24); // Token valid for 24 hours

        // Store hashed token in DB
        await emailVerificationRepository.create(
            user.id,
            hashedToken,
            expiresAt
        );

        // Simulate sending email (In production, integrate with an email service)
        // console.log(`Verification email sent to ${user.email} with token: ${token}`);

        // send email (send raw token, not hashed one)
        await sendVerificationEmail(user.email, user.name, token, user.id);

        return {
            success: true,
            message: 'Verification email sent'
        };
    },

    async verifyEmail(userId, token) {
        const hashedToken = hashToken(token);

        // Find token in DB
        const tokenRecord = await emailVerificationRepository.findByToken(userId, hashedToken);

        if (!tokenRecord) {
            return {
                success: false,
                message: 'Invalid or expired verification token'
            };
        }
        // if (isTokenExpired(tokenRecord.expires_at)) {
        //     return {
        //         success: false,
        //         message: 'Verification token has expired'
        //     };
        // }

        await emailVerificationRepository.markTokenAsUsed(tokenRecord.id);

        // Send welcome email after successful verification
        await sendWelcomeEmail(user.email, user.name);

        return {
            success: true,
            message: 'Email verified successfully'
        };
    },

    // Resend verification email (invalidate old tokens and send new one)
    async resendVerificationEmail(email) {
        // 1. Already verified check -> Stop
        const user = await authRepository.findByEmail(email);

        if(!user){
            throw new Error('User not found');
        }
        if(user.email_verified){
            return {
                success: false,
                message: 'Email is already verified'
            };
        }

        // 2. Invalidate old tokens
        await emailVerificationRepository.invalidateOldTokens(user.id);

        // Send new verification email
        await emailVerificationService.sendVerification(user);

        return {
            success: true,
            message: 'Verification email resent successfully'
        }
    }
}