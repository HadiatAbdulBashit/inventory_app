import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import TransactionForm from "../../Components/TransactionForm/TransactionForm.component";

const AddTransaction = () => {
    const navigate = useNavigate();
    const { reset } = useForm()

    const saveData = async(data) => {
        try {
            await axios.post("/api/transaction", data, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            });
            reset();
            navigate("/dashboard/transaction");
        } catch (error) {
            toast.error(error.response.data.msg)
            throw new Error(error);
        }
    }

    const addTransaction = async (data) => {
        await toast.promise(
            saveData(data),
            {
                pending: 'Adding transaction...',
                success: 'Transaction added',
                error: 'Adding transaction failed'
            }
        )
    };

    return (
        <div className="container p-4" style={{ maxWidth: '700px', margin: 'auto' }}>
            <h1 className='mb-4'>Add Transaction</h1>
            <TransactionForm onFormSubmit={addTransaction} title={'Add Transaction'}/>
        </div >
    );
};

export default AddTransaction;
