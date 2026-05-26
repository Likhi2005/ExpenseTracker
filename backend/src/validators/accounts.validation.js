import { z } from 'zod';

export const createAccountSchema = z.object({
    account_name: z.string().min(1, "Account name is required").max(255, "Account name must be less than 255 characters"),
    account_type: z.enum(['savings', 'checking', 'credit', 'cash', 'investment']),
    initial_balance: z.number().min(0, "Balance cannot be negative").optional()
});

export const addMoneySchema = z.object({
    amount: z.number().min(0.01, "Amount must be at least 0.01")
});

export const transferSchema = z.object({
    from_account_id: z.number().positive("Valid from account required"),
    to_account_id: z.number().positive("Valid to account required"),
    amount: z.number().min(0.01, "Amount must be at least 0.01")
});