import { z } from 'zod';

// Regex for hex color codes
const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

export const createCategorySchema = z.object({
    category_name: z.string()
        .min(1, "Category name is required")
        .max(100, "Category name must be less than 100 characters")
        .trim(),
    category_type: z.enum(['income', 'expense'], {
        errorMap: () => ({ message: "Category type must be 'income' or 'expense'" })
    }),
    color_code: z.string()
        .regex(hexColorRegex, "Color code must be a valid hex color (e.g., #FF5733)")
        .optional()
        .default('#000000')
});

export const updateCategorySchema = z.object({
    category_name: z.string()
        .min(1, "Category name is required")
        .max(100, "Category name must be less than 100 characters")
        .trim()
        .optional(),
    color_code: z.string()
        .regex(hexColorRegex, "Color code must be a valid hex color (e.g., #FF5733)")
        .optional()
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
});