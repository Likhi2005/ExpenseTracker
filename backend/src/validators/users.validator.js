import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long").optional(),
    phone: z.string()
        .regex(/^\d{10}$/, "Phone number must be 10 digits")
        .optional(),
    avatarUrl: z.string().url("Invalid avatar URL").optional()
}).refine(
    (data) => Object.values(data).some(v => v !== undefined),
    {
        message: "At least one field is required"
    }
);

export const changePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string()
        .min(8, "New password must be at least 8 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain uppercase, lowercase, and number"
        )
});

export const deleteAccountSchema = z.object({
    password: z.string({
        required_error: "Password is required to delete account"
    })
});