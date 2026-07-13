import { hashPassword, comparePassword, createJWT } from "../../libs/index.js";
import { authRepository } from "./auth.repository.js";
import { AuthenticationError, ValidationError } from "../../utils/errors.js";

export const authService = {
    async signup({ name, email, password }) {

        // Check if user already exists
        const existingUser = await authRepository.findByEmail(email);
        if (existingUser) {

            if (!existingUser.email_verified){
                throw new ValidationError("Email not verified. Please verify your email before signing up.");
            }
            throw new ValidationError("Email already exists");
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await authRepository.create(name, email, hashedPassword);

        // Generate token
        // const token = createJWT(user.id);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.created_at,
            }, token: null
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

        // Check if email is verified
        if(!user.email_verified) {
            throw new AuthenticationError("Email not verified. Please verify your email before signing in.");
        }

        // Generate token
        const token = createJWT(user.id);

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