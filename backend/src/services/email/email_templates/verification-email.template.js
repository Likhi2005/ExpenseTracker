const emailVerificationTemplate = (name, verificationLink) => `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #7c3aed; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .button { display: inline-block; background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { color: #6b7280; font-size: 12px; margin-top: 20px; }
                    .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Welcome to ExpenseTracker! 💰</h2>
                    </div>
                    
                    <div class="content">
                        <p>Hi <strong>${name}</strong>,</p>
                        
                        <p>Thank you for registering with ExpenseTracker. To complete your registration and activate your account, please verify your email address.</p>
                        
                        <center>
                            <a href="${verificationLink}" class="button">Verify Email Address</a>
                        </center>
                        
                        <p>Or copy this link in your browser:</p>
                        <code style="background-color: #e5e7eb; padding: 10px; display: block; word-break: break-all;">
                            ${verificationLink}
                        </code>
                        
                        <div class="warning">
                            <strong>⏰ Important:</strong> This verification link expires in ${config.emailVerification.expiryHours} hours.
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px;">
                            If you didn't create an ExpenseTracker account, you can safely ignore this email.
                        </p>
                        
                        <div class="footer">
                            <hr style="border: none; border-top: 1px solid #e5e7eb;">
                            <p>© 2026 ExpenseTracker. All rights reserved.</p>
                            <p>This is a transactional email. Please do not reply to this email.</p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `;