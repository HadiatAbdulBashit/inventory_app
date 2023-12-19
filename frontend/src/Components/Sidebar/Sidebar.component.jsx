import {
    Sidebar,
    Menu,
    MenuItem,
} from 'react-pro-sidebar';
import { RiDashboardLine, RiInboxUnarchiveLine, RiInboxArchiveLine, RiArchive2Line, RiGroupLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import style from './Sidebar.module.css'

const SidebarMenu = ({ collapsed }) => {

    return (
        <Sidebar collapsed={collapsed} width="210px">
            <Menu>
                <hr />
                <MenuItem className={style.appName} icon={<RiArchive2Line />}> Inventory App </MenuItem>
                <hr />
                <MenuItem component={<Link to="/dashboard" />} icon={<RiDashboardLine />}>Dashboard</MenuItem>
                <MenuItem component={<Link to="/purchases" />} icon={<RiInboxArchiveLine />}>Purchases</MenuItem>
                <MenuItem component={<Link to="/sales" />} icon={<RiInboxUnarchiveLine />}>Sales</MenuItem>
                <hr />
                <MenuItem component={<Link to="/user" />} icon={<RiGroupLine />}>Users</MenuItem>
            </Menu>
        </Sidebar>
    )
}

export default SidebarMenu