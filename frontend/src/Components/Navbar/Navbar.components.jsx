import { useContext } from 'react';
import { FaBars, FaRegUser } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import UserContext from '../../Contexts/UserContext';

const Navbar = ({ setCollapsed, collapsed }) => {
    const navigate = useNavigate();

    const { setUser } = useContext(UserContext)

    const handleLogout = async () => {
        try {
            const response = await axios.post('/api/auth/logout');
            toast.success(response.data.message)
            setUser({ isLoggedIn: false })
            navigate('/')
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <button className="btn text-white ms-2" onClick={() => setCollapsed(!collapsed)}>
                <FaBars />
            </button>
            <ul className="navbar-nav ms-auto me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <FaRegUser />
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li>
                            <Link className="dropdown-item" to={"/acount"}>Acount</Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                            <Link className="dropdown-item" onClick={handleLogout}>Logout</Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar