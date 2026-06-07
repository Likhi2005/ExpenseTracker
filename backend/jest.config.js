export default {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',
        '!src/config/database.js',
    ],
    testTimeout: 30000,
    verbose: true,
    forceExit: true,
    transform: {},  // ← Disable transforms for ES modules
    // extensionsToTreatAsEsm: ['.js'],  // ← Treat .js as ES modules
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',  // ← Remove .js extensions in imports
    },
};


// export default {
//     testEnvironment: 'node',
//     setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
//     coveragePathIgnorePatterns: ['/node_modules/'],
//     testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
//     collectCoverageFrom: [
//         'src/**/*.js',
//         '!src/server.js',
//         '!src/config/database.js',
//     ],
//     testTimeout: 10000,
//     verbose: true,
// };