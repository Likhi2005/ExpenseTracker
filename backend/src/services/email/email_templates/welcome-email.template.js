export const emailWelcomeTemplate = (email, name) => `
<!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #10b981; color: white; padding: 20px; border-radius: 8px; }
                    .content { padding: 30px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>✅ Email Verified Successfully!</h2>
                    </div>

                    <div class="content">
                        <p>Hi <strong>${name}</strong>,</p>
                        <p>Your email has been verified and your account is now fully activated!</p>
                        <p>You can now log in and start tracking your expenses.</p>
                        <p>Happy budgeting! 🎉</p>
                    </div>
                </div>
            </body>
        </html>
`;