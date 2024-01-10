import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from 'sweetalert2'

import Pagination from '../../Components/Pagination'
import Search from '../../Components/Search'
import Sort from '../../Components/Sort'
import Filter from "../../Components/Filter";

import { RiEyeLine, RiPencilLine, RiDeleteBin2Line } from "react-icons/ri";
import { LuTable, LuRefreshCcw } from "react-icons/lu";
import { PiCardsLight } from "react-icons/pi";

import UserContext from '../../Contexts/UserContext';

const Items = () => {
  const { user } = useContext(UserContext)

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ sort: "createdAt", order: "asc" });
  const [limit, setLimit] = useState(5);
  const [filter, setFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [showTable, setShowTable] = useState(true)


  useEffect(() => {
    setIsLoading(true)
    getItem();
  }, [page, search, sort, filter, limit]);

  useEffect(() => {
    setPage(1);
  }, [search, limit, filter]);

  const getItem = async () => {
    const response = await axios.get(`/api/item?page=${page}&name=${search}&sort=${sort.sort},${sort.order}&category=${filter}&limit=${limit}`);
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
        await toast.promise(axios.delete(`/api/item/${itemId}`), {
          pending: 'Delete item...',
          success: 'Item Deleted',
          error: 'Delete item failed'
        });
        getItem();
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting the item.",
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
      value: 'category',
      name: 'Category'
    },
    {
      value: 'merk',
      name: 'Merk'
    }
  ];

  return (
    <div className="container p-4" style={{ minWidth: '900px' }}>
      <h1>List Item</h1>
      <div className="panel">
        <div className="panel-heading">
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              {
                user.role === 'Admin' || user.role === 'Office' ? (
                  <Link to="/dashboard/item/add" className="btn btn-primary me-2">
                    Add New
                  </Link>
                ) : null
              }
              <Search setSearch={(search) => setSearch(search)} />
            </div>
            <div className="d-flex gap-1">
              <Sort sort={sort} setSort={(sort) => setSort(sort)} listSort={sortBy} />
              <div className="btn-group">
                <button className={"btn btn-primary d-flex justify-content-around align-items-center" + (showTable ? ' active' : '')} onClick={() => setShowTable(true)}><LuTable /></button>
                <button className={"btn btn-primary d-flex justify-content-around align-items-center" + (!showTable ? ' active' : '')} onClick={() => setShowTable(false)}><PiCardsLight /></button>
              </div>
              <button className="btn btn-primary" onClick={() => { setIsLoading(true), getItem() }}><LuRefreshCcw /></button>
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
            data.items.length === 0 ? (
              <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1>No Item</h1>
              </div>
            ) : showTable ? (
              <div className="panel-body table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      {
                        user.role === 'Admin' ? (
                          <th>Action</th>
                        ) : null
                      }
                      <th>Name</th>
                      <th>Category</th>
                      <th>Merk</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.items?.map((item) => (
                        <tr key={item.id}>
                          {
                            user.role === 'Admin' ? (
                              <td width={'120px'}>
                                <ul className="action-list">
                                  <li>
                                    <Link to={`${item.id}/edit`} className="btn btn-primary me-2">
                                      <RiPencilLine />
                                    </Link>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() => deleteItem(item.id)}
                                      className="btn btn-danger"
                                    >
                                      <RiDeleteBin2Line />
                                    </button>
                                  </li>
                                </ul>
                              </td>
                            ) : null
                          }
                          <td width={'40%'}>{item.name}</td>
                          <td>{item.category}</td>
                          <td>{item.merk}</td>
                          <td>
                            <Link to={`${item.id}`} className="btn btn-success">
                              <RiEyeLine />
                            </Link>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="row mx-0 row-cols-3 row-cols-xxl-4 my-3 row-gap-3">
                {
                  data.items?.map((item) => (
                    <div className="col m-0" key={item.id}>
                      <div className="card">
                        <div style={{ height: '200px' }} className='overflow-hidden' >
                          <img src={item.imageUrl} className="card-img-top" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.name} />
                        </div>
                        <div className="card-body">
                          <h5 className="card-title text-truncate">{item.name}</h5>
                          <p className="card-text text-truncate">{item.description}</p>
                        </div>
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">Category : {item.category}</li>
                          <li className="list-group-item">Brand : {item.merk}</li>
                        </ul>
                        <div className="card-body d-grid">
                          <div className="btn-group">
                            {
                              user.role === 'Admin' ? (
                                <>
                                  <Link to={`${item.id}/edit`} className="btn btn-primary d-flex justify-content-around align-items-center">
                                    <RiPencilLine /> Edit
                                  </Link>
                                  <button
                                    onClick={() => deleteItem(item.id)}
                                    className="btn btn-danger d-flex justify-content-around align-items-center"
                                  >
                                    <RiDeleteBin2Line /> Delete
                                  </button>
                                </>
                              ) : null
                            }
                            <Link to={`${item.id}`} className={"btn btn-success d-flex align-items-center" + (user.role === 'Admin' ? ' justify-content-around' : ' justify-content-center gap-3')}>
                              <RiEyeLine /> View
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
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
              <Filter
                listFilter={data.category ? data.category : []}
                setFilter={(filtered) => setFilter(filtered)}
                title='Category'
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

export default Items;
