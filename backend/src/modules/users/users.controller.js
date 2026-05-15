import { usersService } from "./users.service.js";
import { sendResponse, sendError } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const usersController = {

    // Get user profile
    getProfile: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const user = await usersRepository.findById(userId);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: "User profile fetched successfully",
            data: user
        });
    }),

    // Update profile
    updateProfile: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const { name, phone, avatarUrl } = req.body;

        const updatedUser = await usersService.updateProfile(userId, { 
            name,
            phone,
            avatarUrl
        });

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: "User profile updated successfully",
            data: updatedUser
        });
    }),

    // Chnage Password
    changePassword: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        await usersService.changePassword(userId, currentPassword, newPassword, confirmPassword);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: "Password changed successfully",
        });
    }),

    // Delete account
    deleteAccount: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const { password } = req.body;

        await usersService.deleteAccount(userId, password);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: "Account deleted successfully",
        })
    })
}