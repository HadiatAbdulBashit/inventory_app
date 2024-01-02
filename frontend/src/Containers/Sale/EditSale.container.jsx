import axios from "axios";
import {  useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import TransactionForm from "../../Components/TransactionForm/TransactionForm.component";

const EditSale = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { reset } = useForm()
    const [initialData, setInitialData] = useState({})

    const EditData = async(data) => {
        try {
            await axios.put(`/api/transaction/${id}`, data);
            reset();
        } catch (error) {
            toast.error(error.response.data.msg)
            throw new Error(error);
        }
    }

    const getTransactionById = async () => {
        try {
            const response = await axios.get(`/api/transaction/${id}`);
            setInitialData(response.data)
        } catch (error) {
            toast.error(error.response.data.msg)
            throw new Error(error);
        }
    }

    useEffect(() => {
        getTransactionById();
    }, []);

    const editSale = async (data) => {
        await toast.promise(
            EditData(data),
            {
                pending: 'Editing sale...',
                success: 'Sale edited',
                error: 'Editing sale failed'
            }
        )
        navigate(-1);
    };

    return (
        <div className="container p-4" style={{ maxWidth: '700px', margin: 'auto' }}>
            <h1 className='mb-4'>Edit Sale</h1>
            <TransactionForm onFormSubmit={editSale} initialData={initialData} title={'Edit Sale'} secondParty={'Customer Name'}/>
        </div >
    );
};

export default EditSale;
