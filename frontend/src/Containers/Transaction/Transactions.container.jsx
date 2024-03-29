import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from 'sweetalert2'
import moment from 'moment';

import Pagination from '../../Components/Pagination'
import Search from '../../Components/Search'
import Sort from '../../Components/Sort'
import Filter from "../../Components/Filter";

import { RiEyeLine, RiPencilLine, RiDeleteBin2Line } from "react-icons/ri";
import { LuRefreshCcw } from "react-icons/lu";

import formatRupiah from "../../Utils/formatRupiah";

import UserContext from '../../Contexts/UserContext';

const Transactions = () => {
  const { user } = useContext(UserContext)

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ sort: "createdAt", order: "desc" });
  const [limit, setLimit] = useState(5);
  const [filterType, setFilterType] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [monthFilter, setMonthFilter] = useState(moment().format("YYYY-MM"))
  const [filterDate, setFilterDate] = useState('month');

  useEffect(() => {
    setIsLoading(true)
    getTransactions();
  }, [page, search, sort, filterType, limit, filterStatus, monthFilter, startDate, endDate, filterDate]);

  useEffect(() => {
    setPage(1);
  }, [search, limit, filterType, filterStatus, monthFilter, startDate, endDate, filterDate]);

  const getTransactions = async () => {
    const response = await axios.get(`/api/transaction?page=${page}&search=${search}&sort=${sort.sort},${sort.order}&type=${filterType}&limit=${limit}&status=${filterStatus}` + (filterDate === 'month' ? `&month=${monthFilter.split('-')[1]}&year=${monthFilter.split('-')[0]}` : filterDate === 'range' ? `&startDate=${startDate}&endDate=${endDate}` : ''));
    setData(response.data);
    setIsLoading(false)
  };

  const deleteTransaction = async (transactionId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        await toast.promise(axios.delete(`/api/transaction/${transactionId}`), {
          pending: 'Delete transaction...',
          success: 'Transaction Deleted',
          error: 'Delete transaction failed'
        });
        getTransactions();
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error",
        text: error.response.data.msg,
        icon: "error"
      });
    }
  };

  const sortBy = [
    {
      value: 'type',
      name: 'Type'
    },
    {
      value: 'secondParty',
      name: 'Customer/Suplyer Name'
    },
    {
      value: 'totalPrice',
      name: 'Total Price'
    },
    {
      value: 'status',
      name: 'Status'
    },
    {
      value: 'pocOffice',
      name: 'POC Office'
    },
    {
      value: 'pocWarehouse',
      name: 'POC Warehouse'
    }
  ];

  const onStartDateRangeChange = (e) => {
    const newStartDate = new Date(e.target.value);
    newStartDate.toISOString().split('T')[0]
    setStartDate(newStartDate);
  };

  const onEndDateRangeChange = (e) => {
    const newEndDate = new Date(e.target.value);
    newEndDate.toISOString().split('T')[0]
    setEndDate(newEndDate);
  };

  return (
    <div className="p-4" style={{ minWidth: '1100px' }}>
      <h1>List Transaction</h1>
      <div className="panel">
        <div className="panel-heading">
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <Search setSearch={(search) => setSearch(search)} />
              <div className="dropdown me-2">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownFilterDate" data-bs-toggle="dropdown" aria-expanded="false">
                  Filter Date
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownFilterDate">
                  <li><button className="dropdown-item" type="button" onClick={() => setFilterDate(false)}>None</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => setFilterDate('month')}>Month</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => setFilterDate('range')}>Range Date</button></li>
                </ul>
              </div>
              {
                filterDate === 'month' ? (
                  <input type="month" className='form-control me-2' onChange={e => setMonthFilter(e.target.value)} style={{ width: '150px' }} value={monthFilter} />
                ) : filterDate === 'range' ? (
                  <>
                    <input type="date" onChange={onStartDateRangeChange} className='form-control me-2' style={{ width: '130px' }} value={startDate.toISOString().split('T')[0]} />
                    <input type="date" onChange={onEndDateRangeChange} className='form-control me-2' style={{ width: '130px' }} value={endDate.toISOString().split('T')[0]} />
                  </>
                ) : null
              }
            </div>
            <div className="d-flex">
              <Sort sort={sort} setSort={(sort) => setSort(sort)} listSort={sortBy} />
              <button className="btn btn-primary" onClick={() => { setIsLoading(true), getTransactions() }}><LuRefreshCcw /></button>
            </div>
          </div>
        </div>
        {
          isLoading ? (
            <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            data.transactions.length === 0 ? (
              <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1>No Transaction</h1>
              </div>
            ) : (
              <div className="panel-body table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      {
                        user.role === 'Admin' ? (
                          <th scope="col">Action</th>
                        ) : null
                      }
                      <th>Type</th>
                      <th>Customer/Suplyer</th>
                      <th>Total Price</th>
                      <th>Status</th>
                      <th>Order Date</th>
                      <th>POC Office</th>
                      <th>POC Warehouse</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions?.map((transaction) => (
                      <tr key={transaction.id}>
                        {
                          user.role === 'Admin' ? (
                            <td width={'120px'}>
                              <ul className="action-list">
                                <li>
                                  <Link to={'/dashboard/' + (transaction.type === 'Out' ? 'sale' : 'purchase') + `/${transaction.id}/edit`} className="btn btn-primary me-2">
                                    <RiPencilLine />
                                  </Link>
                                </li>
                                <li>
                                  <button
                                    onClick={() => deleteTransaction(transaction.id)}
                                    className="btn btn-danger"
                                  >
                                    <RiDeleteBin2Line />
                                  </button>
                                </li>
                              </ul>
                            </td>
                          ) : null
                        }
                        <td>{transaction.type}</td>
                        <td width={'20%'}>{transaction.secondParty}</td>
                        <td style={{textAlign: 'right'}}>{formatRupiah(transaction.totalPrice || 0)}</td>
                        <td>
                          <span className={"badge " + (transaction.status === 'Success' || transaction.status === 'Success with Return' ? 'bg-success-subtle text-success-emphasis' : transaction.status === 'Canceled' ? 'bg-danger-subtle text-danger-emphasis' : 'bg-warning-subtle text-warning-emphasis')}>
                            {transaction.status}
                          </span>
                        </td>
                        <td>{moment(transaction.createdAt).format('llll')}</td>
                        <td>{transaction.userOffice.name}</td>
                        <td>{transaction.userWarehouse?.name || '-'}</td>
                        <td>
                          <Link to={`${transaction.id}`} className="btn btn-success">
                            <RiEyeLine />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )
        }
        <div className="panel-footer">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="total-show">Show :</label>
              <div>
                <select className="form-select" id="total-show" value={limit} onChange={(e) => setLimit(e.target.value)}>
                  <option>5</option>
                  <option>10</option>
                  <option>15</option>
                  <option>20</option>
                </select>
              </div>
              <div>
                out of <b>{data.total}</b> entries
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Filter
                listFilter={data.type ? data.type : []}
                setFilter={(filtered) => setFilterType(filtered)}
                title='Type'
              />
              <Filter
                listFilter={data.status ? data.status : []}
                setFilter={(filtered) => setFilterStatus(filtered)}
                title='Status'
              />
              <Pagination
                page={page}
                limit={data.limit ? data.limit : 0}
                total={data.total ? data.total : 0}
                setPage={(page) => setPage(page)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
