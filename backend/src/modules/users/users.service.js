import { usersRepository } from "./users.repository.js";
import { hashPassword, comparePassword } from "../../libs/index.js";
import { ValidationError, AuthenticationError } from "../../utils/errors.js";

export const usersService = {

    // Get user profile
    async getProfile(userId) {
        const user = await usersRepository.findById(userId);

        if(!user){
            throw new ValidationError("User not found");
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatarUrl: user.avatar_url,
            createdAt: user.created_at,
        };
    },

    // Update profile
    async updateProfile(userId, { name, phone, avatarUrl }) {
        const user = await usersRepository.updateProfile(userId, {name, phone, avatarUrl});

        if(!user){
            throw new ValidationError("User not found");
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatarUrl: user.avatar_url,
            updatedAt: user.updated_at,
        };
    },

    // Change password
    async changePassword(userId, currentPassword, newPassword, confirmPassword){
        if(newPassword !== confirmPassword){
            throw new ValidationError('New password and confirm password do not match');
        }

        const user = await usersRepository.findById(userId);

        if(!user){
            throw new ValidationError("User not found");
        }

        const isValid = await comparePassword(currentPassword, user.password)
        if(!isValid){
            throw new AuthenticationError("Current password is incorrect");
        }

        const hashedPassword = await hashPassword(newPassword);
        await usersRepository.updateProfile(userId, {
            password: hashedPassword,
        });
    },

    // Delete account
    async deleteAccount(userId, password){
        const user = await usersRepository.findById(userId);

        if(!userId){
            throw new ValidationError('User not found');
        }

        const isValid = await comparePassword(password, user.password)
        if(!isValid){
            throw new AuthenticationError("Password is incorrect")
        }

        await usersRepository.softDelete(userId);
    },
};