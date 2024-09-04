import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/Navbar.css'
import { useLogout } from '../../hooks/authHooks';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { logoutHandler } = useLogout();
    var token = localStorage.getItem("accessToken")

    const handleLogout = async () => {
        await logoutHandler();
        navigate('/login');
    };


    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/">Main Page</Link>
                {!token ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <Link className="logout-button" to="/login" onClick={handleLogout}>Logout</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;