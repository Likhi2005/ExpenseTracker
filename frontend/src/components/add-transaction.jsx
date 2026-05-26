import { DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect } from "react";
import { useState } from "react";
import { formatCurrency } from "../libs";
import { toast } from "sonner";
import useStore from "../store";
import { useForm } from "react-hook-form";
import DialogWrapper from "./wrappers/dialog-wrapper";
import api from "../libs/apiCall";
import Loading from "./loading";

export const AddTransaction = ({ isOpen, setIsOpen, refetch }) => {
    const { user } = useStore((state) => state);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        defaultValues: {
            transaction_type: 'expense',
            transaction_date: new Date().toISOString().split('T')[0],
            amount: '',
            description: '',
            category: '',
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [accountData, setAccountData] = useState([]);
    const [accountInfo, setAccountInfo] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [seedingCategories, setSeedingCategories] = useState(false);

    const transactionType = watch('transaction_type');

    // Fetch accounts on modal open
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const { data: res } = await api.get('/accounts');
                const accounts = res?.data || [];
                setAccountData(accounts);
                if (accounts.length > 0) {
                    setAccountInfo(accounts[0]);
                }
            } catch (error) {
                console.error('Failed to fetch accounts:', error);
                toast.error('Failed to load accounts');
            }
        };

        if (isOpen && user) {
            fetchAccounts();
        }
    }, [isOpen, user]);

    // Auto-seed categories if empty
    useEffect(() => {
        const seedCategoriesIfNeeded = async () => {
            try {
                setSeedingCategories(true);
                // Try to fetch existing categories
                const { data: res } = await api.get('/categories');

                // If no categories, seed default ones
                if (!res?.data || res.data.length === 0) {
                    console.log('No categories found, seeding defaults...');
                    const { data: seedRes } = await api.post('/categories/seed/defaults');
                    toast.success('Default categories created!');
                    // Fetch categories again after seeding
                    fetchCategoriesByType(transactionType);
                } else {
                    // Categories exist, fetch by type
                    fetchCategoriesByType(transactionType);
                }
            } catch (error) {
                console.error('Error checking categories:', error);
                // Don't show error toast for this background operation
            } finally {
                setSeedingCategories(false);
            }
        };

        if (isOpen && user) {
            seedCategoriesIfNeeded();
        }
    }, [isOpen, user]);

    // Fetch categories based on transaction type
    const fetchCategoriesByType = async (type) => {
        if (!type) return;

        try {
            setLoadingCategories(true);
            const { data: res } = await api.get(
                `/categories/filter/type?type=${type}`
            );
            const fetchedCategories = res?.data || [];

            setCategories(fetchedCategories);

            if (fetchedCategories.length === 0) {
                toast.info(`No ${type} categories available. Please create one.`);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Failed to load categories');
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    // Refetch categories when type changes
    useEffect(() => {
        if (isOpen && transactionType && !seedingCategories) {
            fetchCategoriesByType(transactionType);
        }
    }, [transactionType, isOpen, seedingCategories]);

    const submitHandler = async (formData) => {
        try {
            if (!accountInfo) {
                toast.error('Please select an account');
                return;
            }

            if (!formData.category) {
                toast.error('Please select a category');
                return;
            }

            setIsLoading(true);

            const transactionPayload = {
                transaction_type: formData.transaction_type,
                category: formData.category,
                amount: parseFloat(formData.amount),
                description: formData.description?.trim() || '',
                transaction_date: formData.transaction_date,
            };

            const { data: res } = await api.post(
                `/transactions/account/${accountInfo.id}`,
                transactionPayload
            );

            if (res?.success) {
                toast.success(res?.message || 'Transaction created successfully');
                setIsOpen(false);
                reset();
                refetch?.();
            }
        } catch (error) {
            console.error('Error creating transaction:', error);
            const errorMsg = error?.response?.data?.message || 'Failed to create transaction';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <DialogWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
            <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left shadow-xl'>
                <DialogTitle className='text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-4'>
                    Add New Transaction
                </DialogTitle>

                {isLoading || seedingCategories ? (
                    <Loading />
                ) : (
                    <form onSubmit={handleSubmit(submitHandler)} className='space-y-4'>
                        {/* Account Selection */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Account <span className='text-red-500'>*</span>
                            </label>
                            <select
                                value={accountInfo?.id || ''}
                                onChange={(e) => {
                                    const account = accountData.find(
                                        (a) => a.id === parseInt(e.target.value)
                                    );
                                    setAccountInfo(account);
                                }}
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500'
                            >
                                <option value=''>Select an account</option>
                                {accountData.map((acc) => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.account_name} ({formatCurrency(acc.balance)})
                                    </option>
                                ))}
                            </select>
                            {!accountInfo && accountData.length === 0 && (
                                <p className='text-red-500 text-sm mt-1'>
                                    No accounts available. Please create an account first.
                                </p>
                            )}
                        </div>

                        {/* Transaction Type */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Type <span className='text-red-500'>*</span>
                            </label>
                            <p className='text-xs text-gray-600 dark:text-gray-500 mb-2'>
                                Choose whether this is income, expense, or transfer
                            </p>
                            <select
                                {...register('transaction_type', {
                                    required: 'Transaction type is required'
                                })}
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500'
                            >
                                <option value='income'>💰 Income</option>
                                <option value='expense'>💸 Expense</option>
                                <option value='transfer'>🔄 Transfer</option>
                            </select>
                            {errors.transaction_type && (
                                <p className='text-red-500 text-sm mt-1'>
                                    {errors.transaction_type.message}
                                </p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Category <span className='text-red-500'>*</span>
                            </label>
                            <p className='text-xs text-gray-600 dark:text-gray-500 mb-2'>
                                Select a specific category for this {transactionType}
                            </p>
                            <select
                                {...register('category', {
                                    required: 'Category is required'
                                })}
                                disabled={loadingCategories || categories.length === 0}
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                <option value=''>
                                    {loadingCategories
                                        ? 'Loading...'
                                        : categories.length === 0
                                            ? 'No categories available'
                                            : 'Select category'}
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.category_name}>
                                        {cat.category_name}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className='text-red-500 text-sm mt-1'>
                                    {errors.category.message}
                                </p>
                            )}
                            {categories.length === 0 && !loadingCategories && (
                                <p className='text-amber-600 dark:text-amber-400 text-xs mt-1'>
                                    ⚠️ No categories for this type. Create one in settings or use default categories.
                                </p>
                            )}
                        </div>

                        {/* Amount */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Amount <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='number'
                                step='0.01'
                                min='0.01'
                                {...register('amount', {
                                    required: 'Amount is required',
                                    min: { value: 0.01, message: 'Amount must be at least 0.01' }
                                })}
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500'
                                placeholder='0.00'
                            />
                            {errors.amount && (
                                <p className='text-red-500 text-sm mt-1'>
                                    {errors.amount.message}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Description
                            </label>
                            <textarea
                                {...register('description')}
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500'
                                placeholder='Optional description (e.g., "Lunch at restaurant")'
                                rows='3'
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Date <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='date'
                                {...register('transaction_date', {
                                    required: 'Transaction date is required'
                                })}
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500'
                            />
                            {errors.transaction_date && (
                                <p className='text-red-500 text-sm mt-1'>
                                    {errors.transaction_date.message}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className='flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
                            <button
                                type='button'
                                onClick={() => setIsOpen(false)}
                                className='flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                type='submit'
                                disabled={isLoading}
                                className='flex-1 px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
                            >
                                {isLoading ? 'Creating...' : 'Add Transaction'}
                            </button>
                        </div>
                    </form>
                )}
            </DialogPanel>
        </DialogWrapper>
    );
};