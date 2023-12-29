import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from 'sweetalert2'
import formatRupiah from "../../Utils/formatRupiah";

const Item = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);

  const getItemById = async () => {
    try {
      const response = await axios.get(`/api/item/${id}`);
      setItem(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  const getItemDetail = async () => {
    const response = await axios.get(`/api/item-detail?itemId=${id}`);
    setItemDetails(response.data);
  };

  useEffect(() => {
    getItemById();
    getItemDetail();
  }, []);

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
        navigate("/dashboard/item");
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

  const deleteItemDetail = async (itemId) => {
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
        await toast.promise(axios.delete(`/api/item-detail/${itemId}`), {
          pending: 'Delete item...',
          success: 'Item Deleted',
          error: 'Delete item failed'
        });
        getItemDetail();
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
      <div className="row shadow p-4">
        <div className="col-6">
          <figure>
            <img src={item.imageUrl} alt="Preview Image" className="img-fluid p-3"
            />
          </figure>
        </div>
        <div className="col-6">
          <h2>
            {item.merk} {item.name}
          </h2>
          <p>
            {item.description}
          </p>
          <p>
            Category: {item.category}
          </p>
          <Link to={`edit`} className="btn btn-primary me-1">
            Edit
          </Link>
          <button
            onClick={() => deleteItem(item.id)}
            className="btn btn-danger me-1"
          >
            Delete
          </button>
          <Link to={`/dashboard/item-detail/add/${item.id}`} className="btn btn-primary">
            Add New Unit
          </Link>
          <div className="panel-body table-responsive shadow mt-4 rounded-4">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th scope="col">Unit</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Price</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  itemDetails.length === 0 ? (
                    <tr>
                      <td colSpan="5" align="center" height='200px'>
                        <h1>
                          No Data
                        </h1>
                      </td>
                    </tr>
                  ) : (
                    itemDetails.map((item) => (
                      <tr key={item.id}>
                        <td>{item.unit}</td>
                        <td>{item.stock}</td>
                        <td>{formatRupiah(item.price)}</td>
                        <td>
                          <Link to={`/dashboard/item-detail/${item.id}/edit`} className="btn btn-primary me-1">
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteItemDetail(item.id)}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
