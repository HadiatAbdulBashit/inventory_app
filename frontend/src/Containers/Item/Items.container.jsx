import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from 'sweetalert2'

import Pagination from '../../Components/Pagination'
import Search from '../../Components/Search'

const Items = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");

  useEffect(() => {
    getItem();
  }, [page, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const getItem = async () => {
    const response = await axios.get(`/api/item?page=${page}&name=${search}`);
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
      <div className="mb-5">
      <Link to="/dashboard/item/add" className="btn color-one">
        Add New
      </Link>
      
			<Search setSearch={(search) => setSearch(search)} />
      </div>
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.items?.map((item, index) => (
            <tr key={item.id}>
              <th scope="row">{index + 1}</th>
              <td>{item.name}</td>
              <td>
                <Link to={`${item.id}`} className="btn btn-info me-1">
                  Detail
                </Link>
                <Link to={`${item.id}/edit`} className="btn btn-primary me-1">
                  Edit
                </Link>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        page={page}
        limit={data.limit ? data.limit : 0}
        total={data.total ? data.total : 0}
        setPage={(page) => setPage(page)}
      />
    </div>
  );
};

export default Items;
