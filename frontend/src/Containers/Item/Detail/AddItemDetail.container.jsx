import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import ItemDetailForm from "../../../Components/ItemDetailForm/ItemDetailForm.component";

const AddItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { reset } = useForm()

    const saveData = async(data) => {
        try {
            await axios.post("/api/item-detail", data);
            reset();
            navigate(`/dashboard/item/${id}`);
        } catch (error) {
            console.log(error);
        }
    }

    const addItem = async (data) => {
        data.itemId = id;
        await toast.promise(
            saveData(data),
            {
                pending: 'Adding item...',
                success: 'Item added',
                error: 'Adding item failed'
            }
        )
    };

    return (
        <div className="container my-5 p-3">
            <ItemDetailForm onFormSubmit={addItem} title={'Add Item'}/>
        </div >
    );
};

export default AddItem;
