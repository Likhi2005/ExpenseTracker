import resend from "./providers/resend.provider.js";
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

import { emailVerificationTemplate } from './email_templates/verification-email.template.js';
import { emailWelcomeTemplate } from './email_templates/welcome-email.template.js';

export const sendVerificationEmail = async (email, name, verificationToken, userId) => {
    const verificationLink = `${config.frontend.url}/email-verified?token=${verificationToken}&userId=${userId}`;

    try {
        const response = await resend.emails.send({
            from: `${config.email.fromName} <${config.email.from}>`,
            to: email,
            subject: 'Verify your ExpenseTracker Email Address',
            html: emailVerificationTemplate(name, verificationLink, config),
        });

        if (response.error) {
            logger.error('Failed to send verification email:', response.error);
            throw new Error('Failed to send verification email');
        }

        logger.info(`Verification email sent to ${email}`);
        return {
            success: true,
            messageId: response.id
        }
    } catch (error) {
        console.error(error.stack);
        logger.error('Email sending failed:', error.mesage);
        throw error;
    }
};

export const sendWelcomeEmail = async (email, name) => {


    try {
        const response = await resend.emails.send({
            from: `${config.email.fromName} <${config.email.from}>`,
            to: email,
            subject: 'Welcome to ExpenseTracker!',
            html: emailWelcomeTemplate(email, name),
        });
    }catch (error) {
        logger.error('Welcome Email sending failed:', error);
        // Don't throw error for welcome email failure, just log it
    }
}