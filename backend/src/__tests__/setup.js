import dotenc from 'dotenv';
import { jest } from '@jest/globals';

// Set test environment
process.env.NODE_ENV = 'test';

dotenc.config({ path: '.env.test' });

// Mock logger if needed
jest.mock('../utils/logger.js', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    },
}));