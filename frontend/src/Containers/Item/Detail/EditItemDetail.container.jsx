import { useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import ItemDetailForm from "../../../Components/ItemDetailForm/ItemDetailForm.component";
import { useState } from "react";

const EditItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { reset } = useForm()
    const [initialData, setInitialData] = useState({})

    const editData = async (data) => {
        try {
            await axios.put(`/api/item-detail/${id}`, data);
            reset();
        } catch (error) {
            console.log(error);
        }
    }

    const getItemById = async () => {
        try {
            const response = await axios.get(`/api/item-detail/${id}`);
            setInitialData(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getItemById();
    }, []);

    const editItem = async (data) => {
        await toast.promise(
            editData(data),
            {
                pending: 'Editing item...',
                success: 'Item Edited',
                error: 'Editing item failed'
            }
        )
        navigate(-1);
    };

    return (
        <div className="container p-4" style={{ maxWidth: '700px', margin: 'auto' }}>
            <h1 className='mb-4'>Edit Unit</h1>
            <ItemDetailForm onFormSubmit={editItem} initialData={initialData} title={'Edit Item'} />
        </div >
    );
};

export default EditItem;
