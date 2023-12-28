import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from 'sweetalert2'

import Pagination from '../../Components/Pagination'
import Search from '../../Components/Search'
import Sort from '../../Components/Sort'
import Filter from "../../Components/Filter";

import { RiEyeLine, RiPencilLine, RiDeleteBin2Line } from "react-icons/ri";

const Items = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ sort: "name", order: "asc" });
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    getItem();
  }, [page, search, sort, filter, limit]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const getItem = async () => {
    const response = await axios.get(`/api/item?page=${page}&name=${search}&sort=${sort.sort},${sort.order}&category=${filter}&limit=${limit}`);
    setData(response.data);
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

  return (
    <div className="container my-5">
      <div className="container">
        <div className="panel">
          <div className="panel-heading">
            <div className="d-flex justify-content-between">
              <div className="row">
                <div className="col-auto">
                  <Link to="/dashboard/item/add" className="btn btn-primary">
                    Add New
                  </Link>
                </div>
                <Search setSearch={(search) => setSearch(search)} />
              </div>
              <Sort sort={sort} setSort={(sort) => setSort(sort)} />
            </div>
            <div>
              <Filter
                filter={filter}
                listFilter={data.category ? data.category : []}
                setFilter={(filtered) => setFilter(filtered)}
                title={'Category'}
              />
            </div>
          </div>
          <div className="panel-body table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Merk</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {data.items?.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <ul className="action-list">
                        <li>
                          <Link to={`${item.id}/edit`} className="btn btn-primary">
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
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.merk}</td>
                    <td>
                      <Link to={`${item.id}`} className="btn btn-success">
                        <RiEyeLine />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tbody>

              </tbody>
            </table>
          </div>
          <div className="panel-footer">
            <div className="row">
              <div className="col-6">
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
              <div className="col-6 align-self-center">
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
  );
};

export default Items;
