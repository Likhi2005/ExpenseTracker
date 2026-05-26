import request from 'supertest';
import app from '../app.js';
import { pool } from '../config/database.js';
// import e from 'express';

describe('Auth Routes', () => {
    beforeAll(async () => {

        // Create users table if it doesn't exist
        await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

        // Clean up test database
        await pool.query('DELETE FROM users');
    });

    afterAll(async() => {
        await pool.end();
    });

    describe('POST /api-v1/auth/sign-up', () => {
        it('should register a new user', async() => {
            const response = await request(app)
                .post('/api-v1/auth/sign-up')
                .send({
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123'
                });
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data).toHaveProperty('token');
        });

        it('should fail with invalid email', async () => {
            const response = await request(app)
                .post('/api-v1/auth/sign-up')
                .send({
                    name: 'Jhon Doe',
                    email: 'testgmail.com',
                    password: 'password123'
                });
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('should fail with short password', async () => {
            const response = await request(app)
                .post('/api-v1/auth/sign-up')
                .send({
                    name: 'Jhon Doe',
                    email: 'jane@example.com',
                    password: 'pass'
                });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('should fail if email already exists', async () => {
            await request(app)
                .post('/api-v1/auth/sign-up')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });
            const response = await request(app)
                .post('/api-v1/auth/sign-up')
                .send({
                    name: 'Another User',
                    email: 'test@example.com',
                    password: 'password3223'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Email already exists');
        });
    });

    describe('POST /api-v1/auth/sign-in', () => {
        beforeEach(async () => {
            await pool.query('DELETE FROM users');
            await request(app)
                .post('/api-v1/auth/sign-up')
                .send({
                    name: 'Test User',
                    email: 'signin@example.com',
                    password: 'password123'
                });
        });

        it('should login user with correct credentials', async () => {
            const response = await request(app)
                .post('/api-v1/auth/sign-in')
                .send({
                    email: 'signin@example.com',
                    password: 'password123'
                });

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty('user');
                expect(response.body.data).toHaveProperty('token');
        });

        it('should fail with incorrect password', async () => {
            const response = await request(app)
                .post('/api-v1/auth/sign-in')
                .send({
                    email: 'signin@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it('should fail with non-existent email', async () => {
            const response = await request(app)
                .post('/api-v1/auth/sign-in')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});