import fs from 'fs';
import path from 'path';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

const migrationsDir = path.join(process.cwd(), 'src', 'database', 'migrations');

export const runMigrations = async () => {
    try{
        // Create migration tracking table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                migration_name VARCHAR(255) UNIQUE NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`
            );
        
            // Get all migration files
            const files = fs.readdirSync(migrationsDir)
                .filter(file => file.endsWith('.sql'))
                .sort();
            
            const result = await pool.query('SELECT migration_name FROM migrations');
            const executedMigrations = new Set((result?.rows || []).map(row => row.migration_name));

            // Run pending migrations
            for (const file of files){
                if(!executedMigrations.has(file)){
                    logger.info(`Running migration: ${file}`);

                    const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

                    await pool.query(sqlContent);
                    await pool.query(
                        'INSERT INTO migrations (migration_name) VALUES ($1)',
                        [file]
                    );
                }
            }
            logger.info('All migrations executed successfully');
    }catch (error) {
        logger.error('Migration error:', error);
        throw error;
    }
};