import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from 'sweetalert2'

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


  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-6">
          <figure>
            <img src={item.imageUrl} alt="Preview Image" className="img-fluid" style={{ maxWidth: '300px' }} />
          </figure>
        </div>
        <div className="col-6">
          <p>
            Name: {item.name}
          </p>
          <p>
            Category: {item.category}
          </p>
          <p>
            Merk: {item.merk}
          </p>
          <p>
            Description: {item.description}
          </p>
          <Link to={`edit`} className="btn btn-primary me-1">
            Edit
          </Link>
          <button
            onClick={() => deleteItem(item.id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
        <div className="col">
          <Link to={`/dashboard/item-detail/add/${item.id}`} className="btn color-one mb-5">
            Add New Unit
          </Link>
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Unit</th>
                <th scope="col">Stock</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {itemDetails.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.unit}</td>
                  <td>{item.stock}</td>
                  <td>{item.price}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Item;
