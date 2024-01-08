import {
    Sidebar,
    Menu,
    MenuItem,
} from 'react-pro-sidebar';
import { BiPurchaseTag } from "react-icons/bi";
import { FiUsers, FiUser } from "react-icons/fi";
import { BsBoxSeam, BsInboxes } from "react-icons/bs";
import { FcElectricalSensor } from "react-icons/fc";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { GrHomeRounded } from "react-icons/gr";
import { TbLogout2 } from "react-icons/tb";
import { BsBag } from "react-icons/bs";
import { Link, useLocation } from 'react-router-dom';
import { RiErrorWarningLine } from "react-icons/ri";
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import style from './Sidebar.module.css'

import UserContext from '../../Contexts/UserContext';

const SidebarMenu = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, setUser } = useContext(UserContext)
    const [url, setUrl] = useState(null);
    const location = useLocation();

    const handleLogout = async () => {
        try {
            const result = await Swal.fire({
                title: "Do you want to log out?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!"
            });

            if (result.isConfirmed) {
                try {
                    const response = await axios.post('/api/auth/logout');
                    toast.success(response.data.message)
                    setUser({ isLoggedIn: false })
                    localStorage.clear('user')
                } catch (error) {
                    toast.error(error.response.data.message);
                }
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "An error occurred while loging out.",
                icon: "error"
            });
        }
    };

    useEffect(() => {
        setUrl(location.pathname);
    }, [location]);

    return (
        <Sidebar collapsed={collapsed} width="250px" className={style.container + ' nav-pills'}>
            <Menu>
                <hr />
                <MenuItem className={`${style.appName} nav-link`} icon={<FcElectricalSensor />} onClick={() => setCollapsed(!collapsed)}>Mega Electronic</MenuItem>
                <hr />
                <MenuItem component={<Link to="/dashboard" />} icon={<GrHomeRounded />} className={`nav-link` + (url === "/dashboard" ? " active" : "")}>Dashboard</MenuItem>
                <MenuItem component={<Link to="/dashboard/purchase" />} icon={<BiPurchaseTag />} className={`nav-link` + (url === "/dashboard/purchase" ? " active" : "")}>Purchases</MenuItem>
                <MenuItem component={<Link to="/dashboard/sale" />} icon={<LiaMoneyCheckAltSolid />} className={`nav-link` + (url === "/dashboard/sale" ? " active" : "")}>Sales</MenuItem>
                {
                    user.role === 'Super Admin' || user.role === 'Admin' ? (
                        <MenuItem component={<Link to="/dashboard/transaction" />} icon={<BsBag />} className={`nav-link` + (url === "/dashboard/transaction" ? " active" : "")}>Transactions</MenuItem>
                    ) : null
                }
                <hr />
                <MenuItem component={<Link to="/dashboard/item" />} icon={<BsBoxSeam />} className={`nav-link` + (url === "/dashboard/item" ? " active" : "")}>Items</MenuItem>
                <MenuItem component={<Link to="/dashboard/item/stock" />} icon={<BsInboxes />} className={`nav-link` + (url === "/dashboard/item/stock" ? " active" : "")}>Stock</MenuItem>
                <hr />
                {
                    user.role === 'Super Admin' || user.role === 'Admin' ? (
                        <>
                            <MenuItem component={<Link to="/dashboard/user" />} icon={<FiUsers />} className={`nav-link` + (url === "/dashboard/user" ? " active" : "")}>Users</MenuItem>
                            <hr />
                        </>
                    ) : null
                }
                {
                    user.role === 'Super Admin' ? (
                        <>
                            <MenuItem component={<Link to="/dashboard/log" />} icon={<RiErrorWarningLine />} className={`nav-link` + (url === "/dashboard/log" ? " active" : "")}>App Log</MenuItem>
                            <hr />
                        </>
                    ) : null
                }
                <MenuItem component={<Link to="/dashboard/acount" />} icon={<FiUser />} className={`nav-link` + (url === "/dashboard/acount" ? " active" : "")}>Acount</MenuItem>
                <MenuItem onClick={handleLogout} icon={<TbLogout2 />}>Logout</MenuItem>
            </Menu>
        </Sidebar>
    )
}

export default SidebarMenu