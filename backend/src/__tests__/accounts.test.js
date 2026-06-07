import { accountsService } from '../modules/accounts/accounts.service.js';
import { accountsRepository } from '../modules/accounts/accounts.repository.js';
import { ValidationError, AuthenticationError } from '../utils/errors.js';

jest.mock('../modules/accounts/accounts.repository.js');

describe('Accounts Service', () => {
    const mockUserId = 1;
    const mockAccountId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllAccounts', () => {
        it('should retrieve all accounts for a user', async () => {
            const mockAccounts = [
                { id: 1, user_id: 1, account_name: 'Savings', balance: 1000 },
                { id: 2, user_id: 1, account_name: 'Checking', balance: 500 }
            ];

            accountsRepository.getAccountsByUserId.mockResolvedValue(mockAccounts);

            const result = await accountsService.getAllAccounts(mockUserId);

            expect(result).toEqual(mockAccounts);
            expect(accountsRepository.getAccountsByUserId).toHaveBeenCalledWith(mockUserId);
        });

        it('should throw AuthenticationError if userId is missing', async () => {
            await expect(accountsService.getAllAccounts(null)).rejects.toThrow(AuthenticationError);
        });
    });

    describe('createAccount', () => {
        it('should create a new account', async () => {
            const accountData = {
                account_name: 'New Savings',
                account_type: 'savings',
                initial_balance: 5000
            };

            const mockCreatedAccount = { id: 3, user_id: 1, ...accountData };

            accountsRepository.checkAccountExists.mockResolvedValue(null);
            accountsRepository.createAccount.mockResolvedValue(mockCreatedAccount);

            const result = await accountsService.createAccount(mockUserId, accountData);

            expect(result).toEqual(mockCreatedAccount);
            expect(accountsRepository.checkAccountExists).toHaveBeenCalledWith(mockUserId, accountData.account_name);
        });

        it('should throw ValidationError if account already exists', async () => {
            const accountData = {
                account_name: 'Existing Account',
                account_type: 'checking'
            };

            accountsRepository.checkAccountExists.mockResolvedValue({ id: 1 });

            await expect(accountsService.createAccount(mockUserId, accountData))
                .rejects.toThrow(ValidationError);
        });

        it('should throw AuthenticationError if userId is missing', async () => {
            const accountData = {
                account_name: 'Test',
                account_type: 'savings'
            };

            await expect(accountsService.createAccount(null, accountData))
                .rejects.toThrow(AuthenticationError);
        });
    });

    describe('addMoneyToAccount', () => {
        it('should add money to account and update balance', async () => {
            const mockAccount = { id: 1, user_id: 1, balance: 1000 };
            const amount = 500;

            accountsRepository.getAccountByIdAndUserId.mockResolvedValue(mockAccount);
            accountsRepository.updateAccountBalance.mockResolvedValue({
                ...mockAccount,
                balance: 1500
            });

            const result = await accountsService.addMoneyToAccount(mockAccountId, mockUserId, amount);

            expect(result.balance).toBe(1500);
            expect(accountsRepository.updateAccountBalance).toHaveBeenCalledWith(mockAccountId, 1500);
        });

        it('should throw ValidationError if amount is invalid', async () => {
            await expect(accountsService.addMoneyToAccount(mockAccountId, mockUserId, null))
                .rejects.toThrow();
        });
    });

    describe('withdrawMoneyFromAccount', () => {
        it('should withdraw money from account', async () => {
            const mockAccount = { id: 1, user_id: 1, balance: 1000 };
            const amount = 300;

            accountsRepository.getAccountByIdAndUserId.mockResolvedValue(mockAccount);
            accountsRepository.updateAccountBalance.mockResolvedValue({
                ...mockAccount,
                balance: 700
            });

            const result = await accountsService.withdrawMoneyFromAccount(mockAccountId, mockUserId, amount);

            expect(result.balance).toBe(700);
        });

        it('should throw ValidationError if insufficient balance', async () => {
            const mockAccount = { id: 1, user_id: 1, balance: 100 };
            const amount = 500;

            accountsRepository.getAccountByIdAndUserId.mockResolvedValue(mockAccount);

            await expect(accountsService.withdrawMoneyFromAccount(mockAccountId, mockUserId, amount))
                .rejects.toThrow(ValidationError);
        });
    });

    describe('transferMoney', () => {
        it('should transfer money between accounts', async () => {
            const fromAccount = { id: 1, user_id: 1, balance: 1000 };
            const toAccount = { id: 2, user_id: 1, balance: 500 };
            const amount = 200;

            accountsRepository.getAccountByIdAndUserId.mockResolvedValue(fromAccount);
            accountsRepository.getAccountById.mockResolvedValue(toAccount);
            accountsRepository.updateAccountBalance
                .mockResolvedValueOnce({ ...fromAccount, balance: 800 })
                .mockResolvedValueOnce({ ...toAccount, balance: 700 });

            const result = await accountsService.transferMoney(mockUserId, {
                from_account_id: 1,
                to_account_id: 2,
                amount
            });

            expect(result.from_account.balance).toBe(800);
            expect(result.to_account.balance).toBe(700);
        });

        it('should throw ValidationError if insufficient balance in from account', async () => {
            const fromAccount = { id: 1, user_id: 1, balance: 100 };

            accountsRepository.getAccountByIdAndUserId.mockResolvedValue(fromAccount);

            await expect(accountsService.transferMoney(mockUserId, {
                from_account_id: 1,
                to_account_id: 2,
                amount: 500
            })).rejects.toThrow(ValidationError);
        });
    });

    describe('deleteAccount', () => {
        it('should delete an account', async () => {
            const mockAccount = { id: 1, user_id: 1 };

            accountsRepository.getAccountByIdAndUserId.mockResolvedValue(mockAccount);
            accountsRepository.deleteAccount.mockResolvedValue({ id: 1 });

            const result = await accountsService.deleteAccount(mockAccountId, mockUserId);

            expect(result.message).toBe('Account deleted successfully');
            expect(accountsRepository.deleteAccount).toHaveBeenCalledWith(mockAccountId);
        });

        it('should throw AuthenticationError if account not found', async () => {
            accountsRepository.getAccountByIdAndUserId.mockResolvedValue(null);

            await expect(accountsService.deleteAccount(mockAccountId, mockUserId))
                .rejects.toThrow(AuthenticationError);
        });
    });
});