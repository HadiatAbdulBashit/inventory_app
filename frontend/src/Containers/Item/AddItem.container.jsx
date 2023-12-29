import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import ItemForm from "../../Components/ItemForm/ItemForm.component";

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
            console.log(error);
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
            <h1 className='mb-4'>Add Item</h1>
            <ItemForm onFormSubmit={addItem} title={'Add Item'}/>
        </div >
    );
};

export default AddItem;
