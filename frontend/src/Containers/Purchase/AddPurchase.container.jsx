import axios from "axios";
import { useContext } from "react";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import TransactionForm from "../../Components/TransactionForm/TransactionForm.component";

import UserContext from '../../Contexts/UserContext';

const AddPurchase = () => {
    const navigate = useNavigate();
    const { reset } = useForm()
    const { user } = useContext(UserContext)

    const saveData = async(data) => {
        data.type = 'In'
        data.pocOffice = user.id
        data.status = 'Inisialization'
        try {
            await axios.post("/api/transaction", data);
            reset();
            navigate("/dashboard/purchase");
        } catch (error) {
            toast.error(error.response.data.msg)
            throw new Error(error);
        }
    }

    const addPurchase = async (data) => {
        await toast.promise(
            saveData(data),
            {
                pending: 'Adding purchase...',
                success: 'Purchase added',
                error: 'Adding purchase failed'
            }
        )
    };

    return (
        <div className="container p-4" style={{ maxWidth: '700px', margin: 'auto' }}>
            <h1 className='mb-4'>Add Purchase</h1>
            <TransactionForm onFormSubmit={addPurchase} title={'Add Purchase'} secondParty={'Suplyer Name'}/>
        </div >
    );
};

export default AddPurchase;
