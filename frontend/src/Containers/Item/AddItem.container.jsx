import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import ItemForm from "../../Components/ItemForm/ItemForm.component";

import { IoChevronBackCircleOutline } from "react-icons/io5";

const AddItem = () => {
    const navigate = useNavigate();
    const { reset } = useForm()

    const saveData = async(data) => {
        try {
            await axios.post("/api/item", data, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            });
            reset();
            navigate("/dashboard/item");
        } catch (error) {
            toast.error(error.response.data.msg)
            throw new Error(error);
        }
    }

    const addItem = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("image", data.image[0]);
        formData.append("category", data.category);
        formData.append("merk", data.merk);
        formData.append("description", data.description);
        await toast.promise(
            saveData(formData),
            {
                pending: 'Adding item...',
                success: 'Item added',
                error: 'Adding item failed'
            }
        )
    };

    return (
        <div className="container p-4" style={{ maxWidth: '700px', margin: 'auto' }}>
            <div className="d-flex justify-content-between">
                <h1 className='mb-4'>Add Item</h1>
                <button className="d-flex align-item-start border-0" style={{ fontSize: '40px', backgroundColor: 'transparent' }} onClick={() => navigate(-1)}>
                    <IoChevronBackCircleOutline />
                </button>
            </div>
            <ItemForm onFormSubmit={addItem} title={'Add Item'}/>
        </div >
    );
};

export default AddItem;
