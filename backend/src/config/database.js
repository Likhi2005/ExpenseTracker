import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './index.js';
import { logger } from '../utils/logger.js';

const { Pool } = pkg;

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const poolConfig = {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: config.db.port,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    maxLifetimeSeconds: 60,
};

// Add SSL for production/RDS(AWS)
if (config.nodeEnv === 'production' || config.db.sslMode === 'require') {
    let sslConfig = {
        rejectUnauthorized: false,
    };

    // If PEM certificate path is provided
    if(config.db.sslCert){
        try{
            const certPath = path.resolve(__dirname, '../../', config.db.sslCert);
            const ca = fs.readFileSync(certPath, 'utf-8');

            sslConfig = {
                ca: [ca],
                rejectUnauthorized: true,
            };
            logger.info(`SSL certificate loaded from: ${config.db.sslCert}`);
        }catch(error){
            logger.error(`Failed to load SSL certificate from ${config.db.sslCert}:`, error.message);
            logger.warn('Falling back to basic SSL without certificate verification');
            sslConfig = {
                rejectUnauthorized: false,
            };
        }
    }

    poolConfig.ssl = sslConfig;
}

logger.info(`Database SSL Mode: ${config.db.sslMode || 'disabled'}`);

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
    logger.info('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    logger.error('PostgreSQL connection error:', err);
});


export default pool;