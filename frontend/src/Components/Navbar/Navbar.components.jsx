import { FaBars, FaRegUser } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Navbar = ({ setCollapsed, collapsed }) => {
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
                            <Link className="dropdown-item" to={'/'}>Logout</Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar