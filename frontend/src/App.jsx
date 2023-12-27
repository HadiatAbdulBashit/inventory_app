import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';

import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'

import "bootstrap/dist/js/bootstrap.bundle.min";

import Root from "./Containers/Root/Root.container";
import LandingPage from './Containers/LandingPage/LandingPage.container';
import Acount from './Containers/Acount/Acount.container';
import Login from './Containers/Login/Login.container';
import ProtectedRoute from './Containers/ProtectedRoute/ProtectedRoute.container';
import Dashboard from './Containers/Dashboard/Dashboard.container';

import Purchase from './Containers/Purchase/Purchase.container';
import Sale from './Containers/Sale/Sale.container';
import User from './Containers/User/User.container';

// Item page
import AddItem from './Containers/Item/AddItem.container';
import EditItem from './Containers/Item/EditItem.container';
import Items from './Containers/Item/Items.container';
import Item from './Containers/Item/Item.container';

// Item Detail page
import AddItemDetail from './Containers/Item/AddItemDetail.container';
import EditItemDetail from './Containers/Item/EditItemDetail.container';

import UserContext from './Contexts/UserContext';

function App() {
  const [user, setUser] = useState({
    isLoggedIn: false,
  })

  const getUser = async () => {
    const isLogin = JSON.parse(localStorage.getItem('user'))
    if (isLogin) {
      const response = await axios.get('/api/auth/me')
      setUser({ ...response.data, isLoggedIn: true })
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
            <Route path='item'>
              <Route index element={<Items />} />
              <Route path='add' element={<AddItem />} />
              <Route path=':id' element={<Item />} />
              <Route path=':id/edit' element={<EditItem />} />
            </Route>
            <Route path='item-detail'>
              <Route path='add/:id' element={<AddItemDetail />} />
              <Route path=':id/edit' element={<EditItemDetail />} />
            </Route>
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
