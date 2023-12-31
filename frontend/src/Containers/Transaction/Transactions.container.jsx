import { useState, useEffect } from "react";
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

import formatRupiah from "../../Utils/formatRupiah";

const Transactions = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ sort: "createdAt", order: "asc" });
  const [limit, setLimit] = useState(5);
  const [filter, setFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getTransaction();
  }, [page, search, sort, filter, limit]);

  useEffect(() => {
    setPage(1);
  }, [search, limit, filter]);

  const getTransaction = async () => {
    const response = await axios.get(`/api/transaction?page=${page}&search=${search}&sort=${sort.sort},${sort.order}&type=${filter}&limit=${limit}`);
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
        getTransaction();
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting the transaction.",
        icon: "error"
      });
    }
  };
  
  const sortBy = ['Status'];

  return (
    <div className="container p-4">
      <h1>List Transaction</h1>
      <div className="panel">
        <div className="panel-heading">
          <div className="d-flex justify-content-between">
            <div className="row">
              <Search setSearch={(search) => setSearch(search)} />
            </div>
            <Sort sort={sort} setSort={(sort) => setSort(sort)} listSort={sortBy} />
          </div>
        </div>
        {
          isLoading ? (
            <div style={{ minHeight: '300px', display: 'flex', alignItem: 'center', justifyContent: 'center' }}>
              <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            data.length === 0 ? (
              <div style={{ minHeight: '300px', display: 'flex', alignItem: 'center', justifyContent: 'center' }}>
                <h1>No Transaction</h1>
              </div>
            ) : (
              <div className="panel-body table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Type</th>
                      <th>Customer/Suplyer</th>
                      <th>Total Price</th>
                      <th>Status</th>
                      <th>Order Date</th>
                      <th>POC Office</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions?.map((transaction) => (
                      <tr key={transaction.id}>
                        <td width={'120px'}>
                          <ul className="action-list">
                            <li>
                              <Link to={`${transaction.id}/edit`} className="btn btn-primary me-2">
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
                        <td>{transaction.type}</td>
                        <td width={'20%'}>{transaction.secondParty}</td>
                        <td>{formatRupiah(transaction.totalPrice)}</td>
                        <td>{transaction.status}</td>
                        <td>{moment(transaction.createdAt).format('llll')}</td>
                        <td>{transaction.userOffice.name}</td>
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
          <div className="row row-cols-2 align-transactions-center justify-content-between">
            <div className="col">
              <div className="row total-show">
                <label htmlFor="total-show" className="col-auto align-self-center">Show :</label>
                <div className="col-auto">
                  <select className="form-select" id="total-show" value={limit} onChange={(e) => setLimit(e.target.value)}>
                    <option>5</option>
                    <option>10</option>
                    <option>15</option>
                    <option>20</option>
                  </select>
                </div>
                <div className="col-auto align-self-center">
                  out of <b>{data.total}</b> entries
                </div>
              </div>
            </div>
            <div className="col">
              <div className="row justify-content-right">
                <div className="col align-self-center">
                  <Filter
                    listFilter={data.type ? data.type : []}
                    setFilter={(filtered) => setFilter(filtered)}
                    title='Type'
                  />
                </div>
                <div className="col-auto align-self-center">
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
      </div>
    </div>
  );
};

export default Transactions;
