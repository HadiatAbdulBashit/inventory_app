import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import UserForm from "../../Components/UserForm/UserForm.component";

import { IoChevronBackCircleOutline } from "react-icons/io5";

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { reset } = useForm()
    const [initialData, setInitialData] = useState({})

    const editData = async (data) => {
        console.log(data);
        try {
            await axios.put(`/api/users/${id}`, data);
            reset();
            navigate(`/dashboard/user`);
        } catch (error) {
            toast.error(error.response.data.msg)
            throw new Error(error);
        }
    }

    const getUserById = async () => {
        try {
            const response = await axios.get(`/api/users/${id}`);
            setInitialData(response.data)
        } catch (error) {
            toast.error(error.response.data.msg)
            throw new Error(error);
        }
    }

    useEffect(() => {
        getUserById();
    }, []);

    const editUser = async (data) => {
        await toast.promise(
            editData(data),
            {
                pending: 'Editing user...',
                success: 'User edited',
                error: 'Editing user failed'
            }
        )
    };

    return (
        <div className="container p-4" style={{ maxWidth: '700px', margin: 'auto' }}>
            <div className="d-flex justify-content-between">
                <h1 className='mb-4'>Edit User</h1>
                <button className="d-flex align-item-start border-0" style={{ fontSize: '40px', backgroundColor: 'transparent' }} onClick={() => navigate(-1)}>
                    <IoChevronBackCircleOutline />
                </button>
            </div>
            <UserForm onFormSubmit={editUser} title={'Edit User'} initialData={initialData} />
        </div >
    );
};

export default EditUser;
