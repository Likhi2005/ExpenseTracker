import { authService } from "./auth.service.js";
import { sendResponse, sendError } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const authController = {

    signup: asyncHandler( async (req, res) => {
        const result = await authService.signup(req.body);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: "User registered successfully",
            data: result
        });
    }),

    signin: asyncHandler( async (req,res) => {
        const result = await authService.signin(req.body);

        sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: "User signed in successfully",
            data: result
        });
    })

}