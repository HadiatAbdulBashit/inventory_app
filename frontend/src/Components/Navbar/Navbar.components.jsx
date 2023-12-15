import { FaBars, FaMagnifyingGlass, FaRegUser } from 'react-icons/fa6';

const Navbar = ({ setCollapsed, collapsed }) => {
    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <button className="btn text-white" onClick={() => setCollapsed(!collapsed)}>
                <FaBars />
            </button>
            <a className="navbar-brand ps-3" href="index.html">Start Bootstrap</a>
            <form className="d-none d-sm-inline-block form-inline ms-auto me-0 me-sm-3 my-2 my-sm-0">
                <div className="input-group">
                    <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                    <button className="btn btn-primary" id="btnNavbarSearch" type="button">
                        <FaMagnifyingGlass />
                    </button>
                </div>
            </form>
            <ul className="navbar-nav ms-auto ms-sm-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <FaRegUser />
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a className="dropdown-item" href="#!">Settings</a></li>
                        <li><a className="dropdown-item" href="#!">Activity Log</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#!">Logout</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar