import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AddItem = () => {
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
      await axios.delete(`/api/item/${itemId}`);
      getItem();
    } catch (error) {
      console.log(error);
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

export default AddItem;
