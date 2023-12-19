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

import UserContext from './Contexts/UserContext';

function App() {
  const [user, setUser] = useState({
    username: '',
    isLoggedIn: false,
    role: 'guest'
  })

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<LandingPage />} />
        <Route element={<ProtectedRoute routeRoleisLoggedIn={false} />}>
          <Route path='/login' element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute routeRoleisLoggedIn={true} />}>
          <Route path='/dashboard' element={<Root />} />
        </Route>
      </>
    )
  )

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router} />
      <ToastContainer />
    </UserContext.Provider>
  )
}

export default App
