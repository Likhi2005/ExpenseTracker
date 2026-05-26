import React, { useEffect, useState } from 'react';
import useStore from '../store';

import { FaBtc, FaPaypal } from 'react-icons/fa';
import { RiVisaLine } from 'react-icons/ri';
import { GiCash } from "react-icons/gi";
import { MdAdd, MdVerifiedUser } from 'react-icons/md';

import api from '../libs/apiCall';
import { toast } from 'sonner';

import Loading from '../components/loading';
import Title from '../components/title';
import AccountMenu from '../components/account-dialog';

import { formatCurrency } from '../libs';

import { AddAccount } from '../components/add-account';
import AddMoney from '../components/add-money-account';
import TransferMoney from '../components/transfer-money';


// ===== ACCOUNT TYPE ICONS =====
const ICONS = {
  savings: (
    <div className='w-12 h-12 bg-emerald-600 text-white flex items-center justify-center rounded-full'>
      <GiCash size={26} />
    </div>
  ),

  checking: (
    <div className='w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full'>
      <RiVisaLine size={26} />
    </div>
  ),

  credit: (
    <div className='w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full'>
      <FaBtc size={26} />
    </div>
  ),

  cash: (
    <div className='w-12 h-12 bg-rose-600 text-white flex items-center justify-center rounded-full'>
      <GiCash size={26} />
    </div>
  ),

  investment: (
    <div className='w-12 h-12 bg-violet-600 text-white flex items-center justify-center rounded-full'>
      <FaPaypal size={26} />
    </div>
  ),
};

const AccountsPage = () => {
  const { user } = useStore((state) => state);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTopup, setIsOpenTopup] = useState(false);
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);

  const [selectedAccount, setSelectedAccount] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ===== FETCH ACCOUNTS =====
  const fetchAccounts = async () => {
    try {
      setIsLoading(true);

      const { data: res } = await api.get('/accounts');

      console.log("Accounts API response:", res);

      setData(res?.data || []);
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Failed to fetch accounts"
      );

      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ===== HANDLE ADD MONEY =====
  const handleOpenAddMoney = (account) => {
    setSelectedAccount(account?.id);
    setIsOpenTopup(true);
  };

  // ===== HANDLE TRANSFER =====
  const handleTransferMoney = (account) => {
    setSelectedAccount(account?.id);
    setIsOpenTransfer(true);
  };

  // ===== INITIAL FETCH =====
  useEffect(() => {
    fetchAccounts();
  }, []);

  // ===== LOADING =====
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className='w-full py-10'>
        {/* ===== HEADER ===== */}
        <div className='flex items-center justify-between'>
          <Title title='Accounts Information' />

          <div className='flex items-center gap-4'>
            <button
              onClick={() => setIsOpen(true)}
              className='py-1.5 px-3 rounded bg-black dark:bg-violet-600 text-white flex items-center gap-1'
            >
              <MdAdd size={22} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* ===== EMPTY STATE ===== */}
        {data?.length === 0 ? (
          <div className='w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-400 text-lg'>
            <span>No Account Found</span>
          </div>
        ) : (
          // ===== ACCOUNTS GRID =====
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-10 gap-6'>
            {data?.map((acc) => (
              <div
                key={acc?.id}
                className='w-full flex flex-col justify-between min-h-48 gap-3 bg-gray-50 dark:bg-slate-800 p-4 rounded-xl shadow'
              >
                <div>
                  {/* ===== ICON ===== */}
                  {ICONS[acc?.account_type?.toLowerCase()]}

                  <div className='space-y-3 w-full mt-4'>
                    {/* ===== TOP SECTION ===== */}
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <p className='text-black dark:text-white text-lg font-bold'>
                          {acc?.account_name}
                        </p>

                        <MdVerifiedUser
                          size={22}
                          className='text-emerald-600 ml-1'
                        />
                      </div>

                      <AccountMenu
                        addMoney={() => handleOpenAddMoney(acc)}
                        transferMoney={() => handleTransferMoney(acc)}
                      />
                    </div>

                    {/* ===== ACCOUNT TYPE ===== */}
                    <span className='text-gray-600 dark:text-gray-400 font-light text-sm uppercase'>
                      {acc?.account_type}
                    </span>

                    {/* ===== CREATED DATE ===== */}
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      {new Date(acc?.created_at).toLocaleDateString("en-US", {
                        dateStyle: "full",
                      })}
                    </p>

                    {/* ===== BALANCE ===== */}
                    <div className='flex items-center justify-between'>
                      <p className='text-xl text-gray-700 dark:text-gray-300 font-semibold'>
                        {formatCurrency(acc?.balance || 0)}
                      </p>

                      <button
                        onClick={() => handleOpenAddMoney(acc)}
                        className='text-sm outline-none text-violet-600 hover:underline'
                      >
                        Add Money
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== ADD ACCOUNT MODAL ===== */}
      <AddAccount
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetch={fetchAccounts}
      />

      {/* ===== ADD MONEY MODAL ===== */}
      <AddMoney
        isOpen={isOpenTopup}
        setIsOpen={setIsOpenTopup}
        id={selectedAccount}
        refetch={fetchAccounts}
      />

      {/* ===== TRANSFER MONEY MODAL ===== */}
      <TransferMoney
        isOpen={isOpenTransfer}
        setIsOpen={setIsOpenTransfer}
        id={selectedAccount}
        refetch={fetchAccounts}
      />
    </>
  );
};

export default AccountsPage;