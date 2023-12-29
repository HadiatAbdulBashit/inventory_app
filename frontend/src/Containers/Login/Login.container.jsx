import { Link, useNavigate } from "react-router-dom"
import { useContext, useState } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { toast } from 'react-toastify';

import UserContext from '../../Contexts/UserContext';

import style from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/auth', data);
      toast.success('Hai ' + response.data.name)
      setUser({...response.data, isLoggedIn: true})
      localStorage.setItem('user', JSON.stringify({isLoggedIn: true}))
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false)
    }
  }

  return (
    <section className="text-center d-flex align-items-center flex-column">
      <Link to={'/'} className={style.linkBack + ' btn btn-primary'}>Back to Lading Page</Link>

      <div className="p-5 bg-image" style={{
        background: 'linear-gradient(130deg, var(--color-one) 0%, var(--color-two) 100%)',
        height: '100vh',
        width: '100%'
      }}></div>

      <div className="card mx-4 mx-md-5 shadow-5-strong col-10 col-sm-8 col-md-6 col-lg-5 col-xl-4" style={{
        marginTop: '-80vh',
        background: 'hsla(0, 0%, 100%, 0.5)',
        backdropFilter: 'blur(20px)',
      }}>
        <div className="card-body py-5 px-md-5">
          <div className="row d-flex justify-content-center">
            <div className="col-10">
              <h2 className="fw-bold mb-5">Log In</h2>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="floatingInput" placeholder="Username"
                    {...register('username', { required: 'Username is Require' })}
                  />
                  <label htmlFor="floatingInput">Username</label>
                </div>
                {errors.username && (
                  <div className="invalid-feedback text-start mb-3 mx-1" style={{ display: 'block' }}>
                    {errors.username.message}
                  </div>
                )}

                <div className="form-floating mb-3">
                  <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                    {...register('password', { required: 'Password is Require' })}
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                {errors.password && (
                  <div className="invalid-feedback text-start mb-3 mx-1" style={{ display: 'block' }}>
                    {errors.password.message}
                  </div>
                )}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-block mb-4 py-3" disabled={loading}>
                    {
                      loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                          <span className="visually-hidden" role="status">Loading...</span>
                        </>
                      ) : (
                        <strong>
                          Login
                        </strong>
                      )
                    }
                  </button>
                </div>
                <p>
                  <a href="#">Forgot password?</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login