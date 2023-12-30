import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from 'sweetalert2'

import Pagination from '../../Components/Pagination'
import Search from '../../Components/Search'
import Sort from '../../Components/Sort'
import Filter from "../../Components/Filter";

import { RiPencilLine, RiDeleteBin2Line } from "react-icons/ri";

const Users = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ sort: "createdAt", order: "asc" });
  const [limit, setLimit] = useState(5);
  const [filter, setFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getUser();
  }, [page, search, sort, filter, limit]);

  useEffect(() => {
    setPage(1);
  }, [search, limit, filter]);

  const getUser = async () => {
    const response = await axios.get(`/api/users?page=${page}&name=${search}&sort=${sort.sort},${sort.order}&category=${filter}&limit=${limit}`);
    setData(response.data);
    setIsLoading(false)
  };

  const deleteItem = async (itemId) => {
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
        await toast.promise(axios.delete(`/api/user/${itemId}`), {
          pending: 'Delete user...',
          success: 'User Deleted',
          error: 'Delete user failed'
        });
        getUser();
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting the user.",
        icon: "error"
      });
    }
  };

  return (
    <div className="container p-4">
      <h1>List User</h1>
      <div className="panel">
        <div className="panel-heading">
          <div className="d-flex justify-content-between">
            <div className="row">
              <div className="col-auto">
                <Link to="/dashboard/user/add" className="btn btn-primary">
                  Add New
                </Link>
              </div>
              <Search setSearch={(search) => setSearch(search)} />
            </div>
            <Sort sort={sort} setSort={(sort) => setSort(sort)} />
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
            data.length === 0 ? (
              <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1>No User</h1>
              </div>
            ) : (
              <div className="panel-body table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.user?.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <ul className="action-list">
                            <li>
                              <Link to={`${user.id}/edit`} className="btn btn-primary me-2">
                                <RiPencilLine />
                              </Link>
                            </li>
                            <li>
                              <button
                                onClick={() => deleteItem(user.id)}
                                className="btn btn-danger"
                              >
                                <RiDeleteBin2Line />
                              </button>
                            </li>
                          </ul>
                        </td>
                        <td>{user.name}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )
        }
        <div className="panel-footer">
          <div className="row row-cols-2 align-items-center justify-content-between">
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
                    listFilter={data.category ? data.category : []}
                    setFilter={(filtered) => setFilter(filtered)}
                    title='Category'
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

export default Users;
