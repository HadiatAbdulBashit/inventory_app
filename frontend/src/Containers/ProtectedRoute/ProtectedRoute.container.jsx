import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import userContext from '../../contexts/UserContext'

function ProtectedRoute({ routeRoleisLoggedIn }) {
    const { user: { isLoggedIn } } = useContext(userContext)

    if (isLoggedIn != routeRoleisLoggedIn) {
        return <Navigate to={'/'} replace />
    }

    return <Outlet />
}

export default ProtectedRoute;