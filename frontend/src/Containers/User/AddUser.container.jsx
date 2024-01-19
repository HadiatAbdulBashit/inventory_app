import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import UserForm from "../../Components/UserForm/UserForm.component";

import { IoChevronBackCircleOutline } from "react-icons/io5";

const AddUser = () => {
    const navigate = useNavigate();
    const { reset } = useForm()

    const saveData = async (data) => {
        try {
            await axios.post("/api/users", data);
            reset();
            navigate(`/dashboard/user`);
        } catch (error) {
            toast.error(error.response.data.msg)
            throw new Error(error);
        }
    }

    const addUser = async (data) => {
        await toast.promise(
            saveData(data),
            {
                pending: 'Adding user...',
                success: 'User added',
                error: 'Adding user failed'
            }
        )
    };

    return (
        <div className="container p-4" style={{ maxWidth: '700px', margin: 'auto' }}>
            <div className="d-flex justify-content-between">
                <h1 className='mb-4'>Add User</h1>
                <button className="d-flex align-item-start border-0" style={{fontSize: '40px', backgroundColor: 'transparent'}} onClick={() => navigate(-1)}>
                    <IoChevronBackCircleOutline />
                </button>
            </div>
            <UserForm onFormSubmit={addUser} title={'Add User'} />
        </div >
    );
};

export default AddUser;
