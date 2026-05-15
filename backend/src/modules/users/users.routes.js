import express from "express";
import { usersController } from "./users.controller.js";
import { validate } from "../../middleware/validation.js";
import authMiddleware from "../../middleware/auth.js";
import {
    updateProfileSchema,
    changePasswordSchema,
    deleteAccountSchema
} from "../../validators/users.validator.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/profile', usersController.getProfile);

router.patch('/profile',
    validate(updateProfileSchema),
    usersController.updateProfile
);

router.post('/change-password',
    validate(changePasswordSchema),
    usersController.changePassword
);

router.delete('/account',
    validate(deleteAccountSchema),
    usersController.deleteAccount
);

export default router;