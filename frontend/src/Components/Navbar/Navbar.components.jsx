import { FaBars, FaRegUser } from 'react-icons/fa6';

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
                        <li><a className="dropdown-item" href="/acount">Acount</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#">Logout</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar