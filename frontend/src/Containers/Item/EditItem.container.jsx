import { useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import ItemForm from "../../Components/ItemForm/ItemForm.component";
import { useState } from "react";

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
            navigate("/dashboard/item");
        } catch (error) {
            console.log(error);
        }
    }

    const getItemById = async () => {
        try {
            const response = await axios.get(`/api/item/${id}`);
            setInitialData(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getItemById();
    }, []);

    const editItem = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
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
        <div className="container my-5 p-3">
            <ItemForm onFormSubmit={editItem} initialData={initialData} title={'Edit Item'}/>
        </div >
    );
};

export default EditItem;
