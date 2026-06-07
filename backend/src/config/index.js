import dotenv from "dotenv";

// Load .env.test in test mode, otherwise .env
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

export const config = {
    // Server
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || "development",

    // Database
    db: {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DB,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT,
        sslMode: process.env.PG_SSL_MODE || 'disable',
        sslCert: process.env.PG_SSL_CERT,
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: "1h",
    },

    // EMail Service (Resend)
    email: {
        apiKey: process.env.EMAIL_CONFIG_API_KEY,
        from: process.env.EMAIL_FROM || 'noreply@expensetracker.com',
        fromName: process.env.FROM_NAME || 'ExpenseTracker',
    },

    // Frontend
    frontend: {
        url: process.env.FRONTEND_URL || "http://localhost:5173",
    },

    // Email Verification
    emailVerification: {
        expiryHours: parseInt(process.env.EMAIL_VERIFICATION_TOKEN_HOURS || '24'),
        tokenLength: parseInt(process.env.EMAIL_VERIFICATION_TOKEN_LENGTH || '32'),
    },

    // Firebase (optional)
    firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
    },
};

// Validate required env vars
// const requiredEnvs = ["JWT_SECRET", "PG_USER", "PG_PASSWORD", "PG_DB", "PG_HOST", "PG_PORT"];
// const missing = requiredEnvs.filter((env) => !process.env[env]);

// if (missing.length) {
//     throw new Error(`Missing environment variables: ${missing.join(", ")}`);
// }

// Validate required env vars (skip in test)
if (process.env.NODE_ENV !== 'test') {
    const requiredEnvs = ["JWT_SECRET", "PG_USER", "PG_PASSWORD", "PG_DB", "PG_HOST", "PG_PORT"];
    const missing = requiredEnvs.filter((env) => !process.env[env]);

    if (missing.length) {
        throw new Error(`Missing environment variables: ${missing.join(", ")}`);
    }
}