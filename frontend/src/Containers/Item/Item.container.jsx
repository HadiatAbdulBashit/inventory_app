import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from 'sweetalert2'

const Item = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState([]);

  const getItemById = async () => {
    try {
      const response = await axios.get(`/api/item/${id}`);
      setItem(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getItemById();
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


  return (
    <div className="container my-5">
      <div className="row">
        <div className="col">
          <figure>
            <img src={item.imageUrl} alt="Preview Image" className="img-fluid" style={{ maxWidth: '300px' }} />
          </figure>
        </div>
        <div className="col">
          <p>
          Name: {item.name}
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
      </div>
    </div>
  );
};

export default Item;
