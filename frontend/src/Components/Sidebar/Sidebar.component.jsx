import {
    Sidebar,
    Menu,
    MenuItem,
} from 'react-pro-sidebar';
import { RiDashboardLine, RiInboxUnarchiveLine, RiInboxArchiveLine, RiArchive2Line, RiGroupLine, RiBox1Line, RiBox3Line } from "react-icons/ri";
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
                <MenuItem component={<Link to="/dashboard/purchase" />} icon={<RiInboxArchiveLine />}>Purchases</MenuItem>
                <MenuItem component={<Link to="/dashboard/sale" />} icon={<RiInboxUnarchiveLine />}>Sales</MenuItem>
                <hr />
                <MenuItem component={<Link to="/dashboard/item" />} icon={<RiBox3Line />}>Items</MenuItem>
                <MenuItem component={<Link to="/dashboard/item-detail" />} icon={<RiBox1Line />}>Item Detail</MenuItem>
                <hr />
                <MenuItem component={<Link to="/dashboard/user" />} icon={<RiGroupLine />}>Users</MenuItem>
            </Menu>
        </Sidebar>
    )
}

export default SidebarMenu