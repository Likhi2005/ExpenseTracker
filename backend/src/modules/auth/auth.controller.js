import { authService } from "./auth.service.js";
import { sendResponse, sendError } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { emailVerificationService } from "./email-verification.service.js";

export const authController = {

    signup: asyncHandler(async (req, res) => {
        const result = await authService.signup(req.body);

        await emailVerificationService.sendVerification(result.user);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: "User registered successfully",
            data: result
        });
    }),

    signin: asyncHandler(async (req, res) => {
        const result = await authService.signin(req.body);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: "User signed in successfully",
            data: result
        });
    }),

    verifyEmail: asyncHandler(async (req, res) => {
        const { token } = req.query;
        const { userId } = req.body;

        const result = await emailVerificationService.verifyEmail(userId, token);

        // if (!result.success) {
        //     return sendError({
        //         res,
        //         statusCode: 400,
        //         success: false,
        //         message: result.message
        //     });
        // }

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: result.message,
            data: result,
        });
    }),

    resendVerificationEmail: asyncHandler(async (req, res) => {
        const { email } = req.body;

        const result = await emailVerificationService.resendVerificationEmail(email);

        // if(!result.success) {
        //     return sendError({
        //         res,
        //         statusCode: 400,
        //         success: false,
        //         message: result.message
        //     });
        // }

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: result.message,
            data: result,
        });
    })

}