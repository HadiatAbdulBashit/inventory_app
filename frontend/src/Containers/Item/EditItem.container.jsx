import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import ItemForm from "../../Components/ItemForm/ItemForm.component";

import { IoChevronBackCircleOutline } from "react-icons/io5";

const EditItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { reset } = useForm()
    const [initialData, setInitialData] = useState({})

    const editData = async (data) => {
        try {
            await axios.put(`/api/item/${id}`, data, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            });
            reset();
            navigate(`/dashboard/item/${id}`);
        } catch (error) {
            toast.error(error.response.data.msg)
            throw new Error(error);
        }
    }

    const getItemById = async () => {
        try {
            const response = await axios.get(`/api/item/${id}`);
            setInitialData(response.data)
        } catch (error) {
            toast.error(error.response.data.msg)
            throw new Error(error);
        }
    }

    useEffect(() => {
        getItemById();
    }, []);

    const editItem = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("category", data.category);
        formData.append("merk", data.merk);
        formData.append("description", data.description);
        formData.append("image", data.image[0]);
        await toast.promise(
            editData(formData),
            {
                pending: 'Editing item...',
                success: 'Item Edited',
                error: 'Editing item failed'
            }
        )
    };

    return (
        <div className="container p-4" style={{ maxWidth: '700px', margin: 'auto' }}>
            <div className="d-flex justify-content-between">
                <h1 className='mb-4'>Edit Item</h1>
                <button className="d-flex align-item-start border-0" style={{ fontSize: '40px', backgroundColor: 'transparent' }} onClick={() => navigate(-1)}>
                    <IoChevronBackCircleOutline />
                </button>
            </div>
            <ItemForm onFormSubmit={editItem} initialData={initialData} title={'Edit Item'}/>
        </div >
    );
};

export default EditItem;
