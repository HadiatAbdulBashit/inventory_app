import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import UserForm from "../../Components/UserForm/UserForm.component";

const AddUser = () => {
    const navigate = useNavigate();
    const { reset } = useForm()

    const saveData = async(data) => {
        try {
            await axios.post("/api/users", data);
            reset();
            navigate(`/dashboard/user`);
        } catch (error) {
            console.log(error);
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
            <h1 className='mb-4'>Add User</h1>
            <UserForm onFormSubmit={addUser} title={'Add User'}/>
        </div >
    );
};

export default AddUser;
