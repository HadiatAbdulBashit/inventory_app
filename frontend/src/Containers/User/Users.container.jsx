import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from 'sweetalert2'

import Pagination from '../../Components/Pagination'
import Search from '../../Components/Search'
import Sort from '../../Components/Sort'
// import Filter from "../../Components/Filter";

import { RiPencilLine, RiDeleteBin2Line, RiKeyLine } from "react-icons/ri";

import UserContext from '../../Contexts/UserContext';

const Users = () => {
  const { user } = useContext(UserContext)
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ sort: "createdAt", order: "asc" });
  const [limit, setLimit] = useState(5);
  // const [filter, setFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getUser();
  }, [page, search, sort, limit]);

  useEffect(() => {
    setPage(1);
  }, [search, limit]);

  const getUser = async () => {
    const response = await axios.get(`/api/users?page=${page}&search=${search}&sort=${sort.sort},${sort.order}&limit=${limit}&role=` + (user.role === 'Super Admin' ? 'Admin' : 'Office,Warehouse'));
    setData(response.data);
    setIsLoading(false)
  };

  const deleteUser = async (userId) => {
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
        await toast.promise(axios.delete(`/api/users/${userId}`), {
          pending: 'Delete user...',
          success: 'User Deleted',
          error: 'Delete user failed'
        });
        getUser();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting the user.",
        icon: "error"
      });
    }
  };


  const resetPassword = async (user) => {
    let randomString = (Math.random() + 1).toString(36).substring(2);

    try {
      const result = await Swal.fire({
        title: `Do you want to reset password ${user.name}?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, reset it!"
      });

      if (result.isConfirmed) {
        try {
          await axios.put(`/api/users/${user.id}/reset`, { newPassword: randomString })
          await Swal.fire({
            title: "Reset Password Success",
            html: `
              <p>The password is <span style="font-weight: bold;">${randomString}</span></p>
            `,
            icon: "info",
            confirmButtonText: 'Copy Password'
          });
          if (result.isConfirmed) {
            const tempInput = document.createElement('input');
            document.body.appendChild(tempInput);
            tempInput.value = randomString;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            await Swal.fire({
              title: 'Copied!',
              text: 'The password has been copied to the clipboard.',
              icon: 'success'
            });
          }
        } catch (error) {
          toast.error(error.response.data.msg)
          throw new Error(error);
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting the user.",
        icon: "error"
      });
    }
  };

  const sortBy = [
    {
      value: 'name',
      name: 'Name'
    },
    {
      value: 'username',
      name: 'Username'
    },
    {
      value: 'role',
      name: 'Role'
    }
  ];

  return (
    <div className="container p-4" style={{minWidth: '650px'}}>
      <h1>List User</h1>
      <div className="panel">
        <div className="panel-heading">
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <Link to="/dashboard/user/add" className="btn btn-primary me-2">
                Add New
              </Link>
              <Search setSearch={(search) => setSearch(search)} />
            </div>
            <Sort sort={sort} setSort={(sort) => setSort(sort)} listSort={sortBy} />
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
            data.users?.length === 0 ? (
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
                    {data.users?.map((user) => (
                      <tr key={user.id}>
                        <td style={{ width: '170px' }}>
                          <ul className="action-list">
                            <li>
                              <Link to={`${user.id}/edit`} className="btn btn-primary me-2">
                                <RiPencilLine />
                              </Link>
                            </li>
                            <li>
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="btn btn-danger me-2"
                              >
                                <RiDeleteBin2Line />
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => resetPassword(user)}
                                className="btn btn-success"
                              >
                                <RiKeyLine />
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
          <div className="d-flex align-items-center justify-content-between">
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
              {/* <Filter
                listFilter={data.role ? data.role : []}
                setFilter={(filtered) => setFilter(filtered)}
                title='Role'
              /> */}
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

export default Users;
