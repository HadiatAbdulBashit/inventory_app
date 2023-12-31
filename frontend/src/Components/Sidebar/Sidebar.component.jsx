import {
    Sidebar,
    Menu,
    MenuItem,
} from 'react-pro-sidebar';
import { GoHomeFill } from "react-icons/go";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaMoneyCheck, FaBox, FaUserGroup, FaUser } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { FcElectricalSensor } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import style from './Sidebar.module.css'

import UserContext from '../../Contexts/UserContext';
import Swal from 'sweetalert2';

const SidebarMenu = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, setUser } = useContext(UserContext)
    console.log(user);

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

    return (
        <Sidebar collapsed={collapsed} width="230px" className={style.container}>
            <Menu>
                <hr />
                <MenuItem className={style.appName} icon={<FcElectricalSensor />} onClick={() => setCollapsed(!collapsed)}>Mega Electronic</MenuItem>
                <hr />
                <MenuItem component={<Link to="/dashboard" />} icon={<GoHomeFill />}>Dashboard</MenuItem>
                <MenuItem component={<Link to="/dashboard/purchase" />} icon={<BiSolidPurchaseTag />}>Purchases</MenuItem>
                <MenuItem component={<Link to="/dashboard/sale" />} icon={<FaMoneyCheck />}>Sales</MenuItem>
                <hr />
                <MenuItem component={<Link to="/dashboard/item" />} icon={<FaBox />}>Items</MenuItem>
                <hr />
                <MenuItem component={<Link to="/dashboard/user" />} icon={<FaUserGroup />}>Users</MenuItem>
                <hr />
                <MenuItem component={<Link to="/dashboard/acount" />} icon={<FaUser />}>{user.name}</MenuItem>
                <MenuItem onClick={handleLogout} icon={<IoLogOut />}>Logout</MenuItem>
            </Menu>
        </Sidebar>
    )
}

export default SidebarMenu