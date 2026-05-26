import { z } from 'zod';

export const createTransactionSchema = z.object({
    transaction_type: z.enum(['income', 'expense', 'transfer'], {
        errorMap: () => ({ message: "Transaction type must be 'income', 'expense', or 'transfer'" })
    }),
    category: z.string().min(1, "Category is required").max(100, "Category must be less than 100 characters"),
    amount: z.number().positive("Amount must be greater than 0"),
    description: z.string().max(500, "Description must be less than 500 characters").optional(),
    transaction_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD")
        .or(z.coerce.date().transform(d => d.toISOString().split('T')[0]))
        .optional()
});

export const updateTransactionSchema = z.object({
    transaction_type: z.enum(['income', 'expense', 'transfer'], {
        errorMap: () => ({ message: "Transaction type must be 'income', 'expense', or 'transfer'" })
    }).optional(),
    category: z.string().min(1, "Category is required").max(100, "Category must be less than 100 characters").optional(),
    amount: z.number().positive("Amount must be greater than 0").optional(),
    description: z.string().max(500, "Description must be less than 500 characters").optional(),
    transaction_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD")
        .or(z.coerce.date().transform(d => d.toISOString().split('T')[0]))
        .optional()
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
});