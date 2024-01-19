import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import ItemDetailForm from "../../../Components/ItemDetailForm/ItemDetailForm.component";

import { IoChevronBackCircleOutline } from "react-icons/io5";

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
        <div className="container p-4" style={{ maxWidth: '700px', margin: 'auto' }}>
            <div className="d-flex justify-content-between">
                <h1 className='mb-4'>Add Unit</h1>
                <button className="d-flex align-item-start border-0" style={{ fontSize: '40px', backgroundColor: 'transparent' }} onClick={() => navigate(-1)}>
                    <IoChevronBackCircleOutline />
                </button>
            </div>
            <ItemDetailForm onFormSubmit={addItem} title={'Add Unit'}/>
        </div >
    );
};

export default AddItem;
