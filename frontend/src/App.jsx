import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'

import "bootstrap/dist/js/bootstrap.bundle.min";

import Root from "./Containers/Root/Root.container";
import LandingPage from './Containers/LandingPage/LandingPage.container';
import Login from './Containers/Login/Login.container';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/dashboard' element={<Root />} />
      </>
    )
  )

  return <RouterProvider router={router} />
}

export default App
