import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import ItemForm from "../../Components/ItemForm/ItemForm.component";

const AddProduct = () => {
    const navigate = useNavigate();

    const {
        reset
    } = useForm()

    const onFormSubmit = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("image", data.image[0]);
        try {
            await axios.post("/api/item", formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            });
            reset();
            navigate("/dashboard/item");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container my-5 p-3">
            <ItemForm onFormSubmit={onFormSubmit}/>
        </div >
    );
};

export default AddProduct;
