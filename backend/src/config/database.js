import pkg from 'pg';
import { config } from './index.js';
import { logger } from '../utils/logger.js';

const { Pool } = pkg;

export const pool = new Pool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: config.db.port,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxLifetimeSeconds: 60,
});

pool.on('connect', () => {
    logger.info('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    logger.error('PostgreSQL connection error:', err);
});


export default pool;