import {
    Sidebar,
    Menu,
    MenuItem,
} from 'react-pro-sidebar';
import { FaBars, FaMagnifyingGlass, FaRegUser } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const SidebarMenu = ({ collapsed }) => {

    return (
        <Sidebar collapsed={collapsed} width="200px">
            <Menu>
                <MenuItem component={<Link to="/documentation" />} icon={<FaBars />}> Documentation</MenuItem>
                <MenuItem component={<Link to="/calendar" />} icon={<FaMagnifyingGlass />}> Calendar</MenuItem>
                <MenuItem component={<Link to="/e-commerce" />} icon={<FaRegUser />}> E-commerce</MenuItem>
                <MenuItem> Examples</MenuItem>
            </Menu>
        </Sidebar>
    )
}

export default SidebarMenu