import { pool } from './src/config/database.js';

const testConnection = async () => {
    try {
        console.log('🔄 Testing database connection with SSL...');
        const result = await pool.query('SELECT NOW() as current_time');
        console.log('✅ Connection successful!');
        console.log('Current time on database:', result.rows[0].current_time);
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:');
        console.error('Error:', error.message);
        if (error.code) console.error('Code:', error.code);
        await pool.end();
        process.exit(1);
    }
};

testConnection();