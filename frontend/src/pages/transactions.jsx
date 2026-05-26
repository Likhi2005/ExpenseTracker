import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatCurrency } from "../libs";
import { toast } from "sonner";
import api from "../libs/apiCall";
import Title from "../components/title";
import { DateRange } from "../components/date-range";
import { IoCheckmarkDoneCircle, IoSearchOutline } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import { CiExport } from "react-icons/ci";
import { AddTransaction } from "../components/add-transaction";
import { ViewTransaction } from "../components/view-transaction";
import Loading from "../components/loading";
import { exportToExcel } from "../libs/exportToExcel";

const Transactions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const handleViewTransaction = (el) => {
    setSelected(el);
    setIsOpenView(true);
  };

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      let URL = `/transactions`;

      // If date range is provided, use the date-range filter
      if (startDate && endDate) {
        URL = `/transactions/filter/date-range?startDate=${startDate}&endDate=${endDate}`;
      }

      const { data: res } = await api.get(URL);

      // Filter by search term locally
      let filteredData = res?.data || [];
      if (search) {
        filteredData = filteredData.filter(
          (item) =>
            item?.description?.toLowerCase().includes(search.toLowerCase()) ||
            item?.category?.toLowerCase().includes(search.toLowerCase())
        );
      }

      setData(filteredData);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch transactions"
      );

      if (error?.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchParams({
      startDate: startDate,
      endDate: endDate,
    });
    await fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, [startDate, endDate]);

  if (isLoading) return <Loading />;

  return (
    <div className='w-full py-10'>
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-10'>
        <Title title='Transactions Activity' />

        <div className='flex flex-col md:flex-row md:items-center gap-4'>
          <DateRange />

          <form onSubmit={handleSearch}>
            <div className='w-full flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-2'>
              <IoSearchOutline className='text-xl text-gray-600 dark:text-gray-500' />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type='text'
                placeholder='Search by description or category...'
                className='outline-none bg-transparent text-gray-700 dark:text-gray-400 placeholder:text-gray-600 dark:placeholder:text-gray-500 w-full'
              />
            </div>
          </form>

          <button
            onClick={() => setIsOpen(true)}
            className='py-1.5 px-2 rounded text-white bg-black dark:bg-violet-800 hover:bg-gray-900 dark:hover:bg-violet-700 flex items-center justify-center gap-2 transition-colors'
          >
            <MdAdd size={22} />
            <span>Add</span>
          </button>

          <button
            onClick={() =>
              exportToExcel(data, `Transactions ${startDate}-${endDate}`)
            }
            className='flex items-center gap-2 text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
          >
            Export <CiExport size={24} />
          </button>
        </div>
      </div>

      <div className='overflow-x-auto mt-5'>
        {data?.length === 0 ? (
          <div className='w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg'>
            <span>No Transaction History</span>
          </div>
        ) : (
          <table className='w-full'>
            <thead className='w-full border-b border-gray-300 dark:border-gray-700'>
              <tr className='w-full text-black dark:text-gray-400 text-left text-sm'>
                <th className='py-2 px-2'>Date</th>
                <th className='py-2 px-2'>Description</th>
                <th className='py-2 px-2'>Category</th>
                <th className='py-2 px-2'>Type</th>
                <th className='py-2 px-2'>Amount</th>
                <th className='py-2 px-2'>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr
                  key={item?.id || index}
                  className='w-full border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                >
                  {/* Date */}
                  <td className='py-4 px-2'>
                    <p className='w-24 md:w-auto text-sm'>
                      {item?.transaction_date
                        ? new Date(item.transaction_date).toDateString()
                        : 'N/A'}
                    </p>
                  </td>

                  {/* Description */}
                  <td className='py-4 px-2'>
                    <div className='flex flex-col w-56 md:w-auto'>
                      <p className='text-base text-black dark:text-gray-400 line-clamp-2'>
                        {item?.description || 'N/A'}
                      </p>
                    </div>
                  </td>

                  {/* Category */}
                  <td className='py-4 px-2'>
                    <span className='inline-block bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-medium text-gray-900 dark:text-gray-300'>
                      {item?.category || 'Uncategorized'}
                    </span>
                  </td>

                  {/* Type */}
                  <td className='py-4 px-2'>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${item?.transaction_type === 'income'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : item?.transaction_type === 'expense'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                    >
                      {item?.transaction_type
                        ? item.transaction_type.toUpperCase()
                        : 'UNKNOWN'}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className='py-4 px-2 text-black dark:text-gray-400 text-base font-medium'>
                    <span
                      className={`font-bold ${item?.transaction_type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                        }`}
                    >
                      {item?.transaction_type === 'income' ? '+' : '-'}
                    </span>
                    {formatCurrency(item?.amount)}
                  </td>

                  {/* View Button */}
                  <td className='py-4 px-2'>
                    <button
                      onClick={() => handleViewTransaction(item)}
                      className='outline-none text-violet-600 dark:text-violet-400 hover:underline text-sm'
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddTransaction
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetch={fetchTransactions}
        key={new Date().getTime()}
      />

      <ViewTransaction
        data={selected}
        isOpen={isOpenView}
        setIsOpen={setIsOpenView}
      />
    </div>
  );
};

export default Transactions;