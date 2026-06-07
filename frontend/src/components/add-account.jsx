import React, { useState } from "react";
import useStore from "../store";
import { useForm } from "react-hook-form";
import { generateAccountNumber } from "../libs";
import DialogWrapper from "./wrappers/dialog-wrapper";
import { Button, DialogPanel, DialogTitle, Input } from "@headlessui/react";
import { MdOutlineWarning } from "react-icons/md";
import { BiLoader } from "react-icons/bi";
import api from "../libs/apiCall";
import { toast } from "sonner";


// Map display names to valid account types
const ACCOUNT_TYPES = {
    "Savings Account": "savings",
    "Checking Account": "checking",
    "Credit Card": "credit",
    "Cash": "cash",
    "Investment": "investment",
};

const accountOptions = Object.keys(ACCOUNT_TYPES);

export const AddAccount = ({
    isOpen, setIsOpen, refetch
}) => {
    const { user } = useStore((state) => state);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            account_number: generateAccountNumber(),
            initial_balance: 0,
        },
    });

    const [selectedAccount, setSelectedAccount] = useState(accountOptions[0]);
    const [loading, setLoading] = useState(false);


    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // Get the valid account type from the mapping
            const accountType = ACCOUNT_TYPES[selectedAccount];

            const payload = {
                account_name: data.account_name,
                account_type: accountType,
                initial_balance: parseFloat(data.initial_balance) || 0,
            };

            console.log("Sending payload", payload);

            const { data: res } = await api.post('/accounts', payload);

            if (res?.data) {
                toast.success(res?.message);
                setIsOpen(false);
                reset()
                refetch();
            }
        } catch (error) {
            console.error("Error details:", {
                status: error?.response?.status,
                message: error?.response?.data?.message,
                error: error?.response?.data,
            });
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    function closeModal() {
        setIsOpen(false);
    }

    console.log(user);
    console.log(selectedAccount);

    return (
        <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
            <DialogPanel className='w-full max-w-md tranform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                    as="h3"
                    className='text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase'
                >
                    Add Account
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Account Type Selection */}
                    <div className="flex flex-col gap-1 mb-2">
                        <label className="text-gray-700 dark:text-gray-400 text-sm mb-2">
                            Account Type
                        </label>
                        <select
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                            className="bg-transparent appearance-none border border-gray-300 dark:border-gray-800 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-500 outline-none focus:ring-1 ring-blue-500"
                        >
                            {accountOptions.map((acc) => (
                                <option
                                    key={acc}
                                    value={acc}
                                    className="dark:bg-slate-900"
                                >
                                    {acc}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Account Name Input */}
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-700 dark:text-gray-400 text-sm">
                            Account Name
                        </label>
                        <Input
                            type="text"
                            placeholder="e.g. My Savings Account"
                            {...register("account_name", {
                                required: "Account Name is required!",
                                minLength: {
                                    value: 1,
                                    message: "Account Name must be at least 1 character",
                                }
                            })}
                            className='border border-gray-300 dark:border-gray-800 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-400 outline-none focus:ring-1 ring-blue-500'
                        />

                    </div>

                    {/* Initial Balance Input */}
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-700 dark:text-gray-400 text-sm">
                            Initial Balance
                        </label>
                        <Input
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            {...register("initial_balance", {
                                min: {
                                    value: 0,
                                    message: "Balance cannot be negative"
                                }
                            })}
                            className="border border-gray-300 dark:border-gray-800 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-400 outline-none focus:ring-1 ring-blue-500"
                        />
                        {errors.initial_balance && (
                            <span className="text-red-500 text-sm">
                                {errors.initial_balance.message}
                            </span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 mt-6">
                        <Button
                            onClick={closeModal}
                            className="flex-1 inline-flex justify-center items-center rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 inline-flex justify-center items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <BiLoader className="animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogPanel>
        </DialogWrapper>
    );
};