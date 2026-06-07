import { DialogPanel, DialogTitle } from '@headlessui/react';
import React from 'react';
import { PiSealCheckFill } from 'react-icons/pi';
import { formatCurrency } from '../libs';
import DialogWrapper from './wrappers/dialog-wrapper';

export const ViewTransaction = ({ data, isOpen, setIsOpen }) => {
    if (!data) return null;

    const longDateString = new Date(data?.transaction_date).toLocaleDateString("en-US", {
        dateStyle: "full",
    });

    const longTimeString = new Date(data?.transaction_date).toLocaleTimeString("en-US");

    const transactionTypeClass = data?.transaction_type === 'income'
        ? 'text-emerald-600'
        : data?.transaction_type === 'expense'
            ? 'text-red-600'
            : 'text-blue-600';

    return (
        <DialogWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
            <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left'>
                <DialogTitle
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase'
                >
                    Transaction Detail
                </DialogTitle>

                <div className='space-y-3'>
                    {/* Category Badge */}
                    <div className='flex items-center gap-3'>
                        <span className='inline-block bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded text-sm font-semibold text-gray-900 dark:text-gray-200'>
                            {data?.category}
                        </span>
                        <span
                            className={`inline-block px-3 py-1 rounded text-sm font-semibold ${data?.transaction_type === 'income'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : data?.transaction_type === 'expense'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}
                        >
                            {data?.transaction_type?.toUpperCase()}
                        </span>
                        <PiSealCheckFill size={24} className='text-emerald-500 ml-auto' />
                    </div>

                    {/* Description and Date */}
                    <div className='border-y border-gray-300 dark:border-gray-800 py-3'>
                        <p className='text-lg font-semibold text-black dark:text-white'>
                            {data?.description || 'No Description'}
                        </p>
                        <span className='text-xs text-gray-600 dark:text-gray-500'>
                            {longDateString} • {longTimeString}
                        </span>
                    </div>
                </div>

                {/* Amount Display */}
                <div className='mt-6 mb-6 flex justify-between items-center'>
                    <p className='text-black dark:text-gray-400 text-2xl font-bold'>
                        <span className={`${transactionTypeClass} font-bold mr-1`}>
                            {data?.transaction_type === 'income' ? '+' : '-'}
                        </span>
                        {formatCurrency(data?.amount)}
                    </p>
                </div>

                {/* Footer Info */}
                <div className='text-xs text-gray-600 dark:text-gray-500 mb-4'>
                    <p>ID: {data?.id}</p>
                    <p>Created: {new Date(data?.created_at).toLocaleString()}</p>
                </div>

                <button
                    type='button'
                    className='w-full rounded-md outline-none bg-violet-600 hover:bg-violet-700 px-4 py-2 text-sm font-medium text-white transition-colors'
                    onClick={() => setIsOpen(false)}
                >
                    Got it, thanks!
                </button>
            </DialogPanel>
        </DialogWrapper>
    );
};