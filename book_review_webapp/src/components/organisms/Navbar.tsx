import { Link, useNavigate } from 'react-router-dom';
import '../../css/Navbar.css'
import { useGetMe, useLogout } from '../../hooks/authHooks';
import { useEffect, useState } from 'react';
import { UserResponse } from '../../model/user';

const Navbar = () => {
    const navigate = useNavigate();
    const { logoutHandler } = useLogout();
    const { getMeHandler } = useGetMe();
    const [user, setUser] = useState<UserResponse | null>(null);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (token) {
            // Fetch user data only if token exists
            getMeHandler().then((res) => {
                if (res) {
                    setUser(res);
                }
            });
        }
    }, [token]);

    const handleLogout = async () => {
        await logoutHandler();
        setUser(null); // Clear user on logout
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
                        <Link to="/my-account">My Account</Link>
                        {user?.role === 'admin' && (
                            <Link to="/create-book">Add Book</Link>
                        )}
                        <Link to="/" onClick={handleLogout}>Logout</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;