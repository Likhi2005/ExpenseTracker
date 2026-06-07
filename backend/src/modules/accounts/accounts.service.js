import { accountsRepository } from './accounts.repository.js';
import { ValidationError, AuthenticationError } from '../../utils/errors.js';

export const accountsService = {

    // Get all accounts for user
    async getAllAccounts(userId) {
        if (!userId) {
            throw new AuthenticationError('User ID is required');
        }

        const accounts = await accountsRepository.getAccountsByUserId(userId);
        return accounts;
    },

    // Create a new account for user
    async createAccount(userId, { account_name, account_type, initial_balance = 0 }) {
        if (!userId) {
            throw new AuthenticationError('User ID is required');
        }

        // Check if account already exists for user
        const existingAccount = await accountsRepository.checkAccountExists(userId, account_name);
        if (existingAccount) {
            throw new ValidationError('Account with this name already exists');
        }

        // Create account
        const account = await accountsRepository.createAccount(
            userId,
            account_name,
            account_type,
            initial_balance
        );
        return account;
    },

    // Add money to Account
    async addMoneyToAccount(accountId, userId, amount) {
        if (!accountId || !userId) {
            throw new ValidationError('Account ID and User ID are required');
        }

        // Verify account belongs to user
        const account = await accountsRepository.getAccountByIdAndUserId(accountId, userId);
        if (!account) {
            throw new AuthenticationError('Account not found or does not belong to user');
        }

        // Calculate new balance
        const newBalance = parseFloat(account.balance) + parseFloat(amount);

        // Update balance
        const updatedAccount = await accountsRepository.updateAccountBalance(accountId, newBalance);

        return updatedAccount;
    },

    // Withdraw money from account
    async withdrawMoneyFromAccount(accountId, userId, amount) {
        if (!accountId || !userId) {
            throw new ValidationError("Account ID and User ID are required");
        }

        // Verify account belongs to user
        const account = await accountsRepository.getAccountByIdAndUserId(accountId, userId);
        if (!account) {
            throw new AuthenticationError("Account not found or unauthorized");
        }

        // Check sufficient balance
        const newBalance = parseFloat(account.balance) - parseFloat(amount);
        if (newBalance < 0) {
            throw new ValidationError("Insufficient balance");
        }

        // Update balance
        const updatedAccount = await accountsRepository.updateAccountBalance(accountId, newBalance);

        return updatedAccount;
    },

    // Transfer money between accounts
    async transferMoney(userId, { from_account_id, to_account_id, amount }) {
        if (!userId) {
            throw new AuthenticationError("User ID is required");
        }

        // Verify both accounts belong to user
        const fromAccount = await accountsRepository.getAccountByIdAndUserId(from_account_id, userId);
        if (!fromAccount) {
            throw new AuthenticationError("From account not found or unauthorized");
        }

        const toAccount = await accountsRepository.getAccountById(to_account_id);
        if (!toAccount) {
            throw new ValidationError("To account not found");
        }

        // Check sufficient balance
        const newFromBalance = parseFloat(fromAccount.balance) - parseFloat(amount);
        if (newFromBalance < 0) {
            throw new ValidationError("Insufficient balance in from account");
        }

        // Update both accounts
        const newToBalance = parseFloat(toAccount.balance) + parseFloat(amount);

        const [updatedFromAccount, updatedToAccount] = await Promise.all([
            accountsRepository.updateAccountBalance(from_account_id, newFromBalance),
            accountsRepository.updateAccountBalance(to_account_id, newToBalance)
        ]);

        return {
            from_account: updatedFromAccount,
            to_account: updatedToAccount
        };
    },

    // Delete account
    async deleteAccount(accountId, userId) {
        if (!accountId || !userId) {
            throw new ValidationError("Account ID and User ID are required");
        }

        // Verify account belongs to user
        const account = await accountsRepository.getAccountByIdAndUserId(accountId, userId);
        if (!account) {
            throw new AuthenticationError("Account not found or unauthorized");
        }

        // Delete account
        await accountsRepository.deleteAccount(accountId);

        return { message: "Account deleted successfully" };
    },

    // Get account by ID with authorization
    async getAccountDetails(accountId, userId) {
        if (!accountId || !userId) {
            throw new ValidationError("Account ID and User ID are required");
        }

        const account = await accountsRepository.getAccountByIdAndUserId(accountId, userId);
        if (!account) {
            throw new AuthenticationError("Account not found or unauthorized");
        }

        return account;
    },

}