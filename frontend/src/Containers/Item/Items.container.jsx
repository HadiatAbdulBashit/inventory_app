import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from 'sweetalert2'

const Items = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getItem();
  }, []);

  const getItem = async () => {
    const response = await axios.get("/api/item");
    setItems(response.data);
  };

  const deleteProduct = async (itemId) => {
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
        await toast.promise(axios.delete(`/api/item/${itemId}`),{
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
      <Link to="/dashboard/item/add" className="btn color-one mb-5">
        Add New
      </Link>
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
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
                  onClick={() => deleteProduct(item.id)}
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
  );
};

export default Items;
