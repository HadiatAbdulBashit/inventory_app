import axios from "axios";
import { useContext } from "react";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import TransactionForm from "../../Components/TransactionForm/TransactionForm.component";

import UserContext from '../../Contexts/UserContext';

import { IoChevronBackCircleOutline } from "react-icons/io5";

const AddSale = () => {
    const navigate = useNavigate();
    const { reset } = useForm()
    const { user } = useContext(UserContext)

    const saveData = async(data) => {
        data.type = 'Out'
        data.pocOffice = user.id
        data.status = 'Inisialization'
        data.totalPrice = 0
        try {
            await axios.post("/api/transaction", data);
            reset();
            navigate("/dashboard/sale");
        } catch (error) {
            toast.error(error.response.data.msg)
            throw new Error(error);
        }
    }

    const addSale = async (data) => {
        await toast.promise(
            saveData(data),
            {
                pending: 'Adding sale...',
                success: 'Sale added',
                error: 'Adding sale failed'
            }
        )
    };

    return (
        <div className="container p-4" style={{ maxWidth: '700px', margin: 'auto' }}>
            <div className="d-flex justify-content-between">
                <h1 className='mb-4'>Add Sale</h1>
                <button className="d-flex align-item-start border-0" style={{fontSize: '40px', backgroundColor: 'transparent'}} onClick={() => navigate(-1)}>
                    <IoChevronBackCircleOutline />
                </button>
            </div>
            <TransactionForm onFormSubmit={addSale} title={'Add Sale'} secondParty={'Customer Name'}/>
        </div >
    );
};

export default AddSale;
