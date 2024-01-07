import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'react-toastify';

import ResetPasswordForm from '../../Components/ResetPasswordForm/ResetPasswordForm.component';

import UserContext from '../../Contexts/UserContext';

const Acount = () => {
  const { user } = useContext(UserContext)

  const saveToDatabase = async (data) => {
    try {
      await axios.put(`/api/users/${user.id}/reset`, data);
    } catch (error) {
      toast.error(error.response.data.msg)
      throw new Error(error);
    }
  }

  const resetPassword = async (data) => {
    await toast.promise(
      saveToDatabase(data),
      {
        pending: 'Reseting password...',
        success: 'Password reseted',
        error: 'Reseting password failed'
      }
    )
  };

  return (
    <div className="container p-4" style={{ maxWidth: '500px' }}>
      <h1>Acount</h1>
      <div className="panel p-5">
        <h4>Login as</h4>
        <h2 className='pb-5'>
          {user.name}<br />{user.role}
        </h2>
        <hr />
        <ResetPasswordForm resetPassword={resetPassword} />
      </div>
    </div>
  )
}

export default Acount