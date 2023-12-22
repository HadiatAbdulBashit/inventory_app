import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'

import "bootstrap/dist/js/bootstrap.bundle.min";

import Root from "./Containers/Root/Root.container";
import LandingPage from './Containers/LandingPage/LandingPage.container';
import Login from './Containers/Login/Login.container';
import ProtectedRoute from './Containers/ProtectedRoute/ProtectedRoute.container';
import Dashboard from './Containers/Dashboard/Dashboard.container';
import Item from './Containers/Item/Item.container';

import UserContext from './Contexts/UserContext';
import { useEffect } from 'react';
import axios from 'axios';
import Purchase from './Containers/Purchase/Purchase.container';
import Sale from './Containers/Sale/Sale.container';
import User from './Containers/User/User.container';
import Acount from './Containers/Acount/Acount.container';

function App() {
  const [user, setUser] = useState({
    isLoggedIn: false,
  })

  const getUser = async () => {
    const isLogin = JSON.parse(localStorage.getItem('user'))
    if (isLogin) {
      const response = await axios.get('/api/auth/me')
      setUser({...response.data, isLoggedIn: true})
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<LandingPage />} />
        <Route element={<ProtectedRoute routeRoleisLoggedIn={false} />}>
          <Route path='/login' element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute routeRoleisLoggedIn={true} />}>
          <Route path='/dashboard' element={<Root />}>
            <Route index element={<Dashboard />} />
            <Route path='item' element={<Item />} />
            <Route path='purchase' element={<Purchase />} />
            <Route path='sale' element={<Sale />} />
            <Route path='user' element={<User />} />
            <Route path='acount' element={<Acount />} />
          </Route>
        </Route>
      </>
    )
  )

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router} />
      <ToastContainer position='bottom-right' />
    </UserContext.Provider>
  )
}

export default App
