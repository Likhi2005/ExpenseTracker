import dotenv from "dotenv";

dotenv.config()

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
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: "1h",
    },

    // Frontend
    frontend: {
        url: process.env.FRONTEND_URL || "http://localhost:5173",
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
const requiredEnvs = ["JWT_SECRET", "PG_USER", "PG_PASSWORD", "PG_DB", "PG_HOST", "PG_PORT"];
const missing = requiredEnvs.filter((env) => !process.env[env]);

if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
}