import { hashPassword, comparePassword, createJWT } from "../../libs/index.js";
import { authRepository } from "./auth.repository.js";
import { AuthenticationError, ValidationError } from "../../utils/errors.js";

export const authService = {
    async signup({ name, email, password }) {

        // Check if user already exists
        const existingUser = await authRepository.findByEmail(email);
        if (existingUser) {
            throw new ValidationError("Email already in use");
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await authRepository.create(name, email, hashedPassword);

        // Generate token
        const token = createJWT({ userId: user.id });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.created_at,
            }, token
        };
    },

    async signin({ email, password }) {
        // Find user by email
        const user = await authRepository.findByEmail(email);
        if (!user) {
            throw new AuthenticationError("Invalid email or password");
        }

        // Compare password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            throw new AuthenticationError("Invalid credentials");
        }

        // Generate token
        const token = createJWT({ userId: user.id });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.created_at,
            }, token
        };
    },
}