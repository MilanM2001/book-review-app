import { Link, Routes, useNavigate } from 'react-router-dom';
import '../../css/Navbar.css'
import { useGetMe, useLogout } from '../../hooks/authHooks';
import { useEffect, useState } from 'react';
import { UserResponse } from '../../model/user';
import { AppRoute } from '../../routing/routesEnum';

const Navbar = () => {
    const navigate = useNavigate();
    const { logoutHandler } = useLogout();
    const { getMeHandler } = useGetMe();
    const [user, setUser] = useState<UserResponse | null>(null);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (token) {
            getMeHandler().then((res) => {
                if (res) {
                    setUser(res);
                }
            });
        }
    }, [token]);

    const handleLogout = async () => {
        await logoutHandler();
        setUser(null); 
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/">Main Page</Link>
                {!token ? (
                    <>
                        <Link to={AppRoute.LOGIN}>Login</Link>
                        <Link to={AppRoute.REGISTER}>Register</Link>
                    </>
                ) : (
                    <>
                        <Link to={AppRoute.MY_ACCOUNT}>My Account</Link>
                        {user?.role === 'admin' && (
                            <Link to={AppRoute.CREATE_BOOK}>Add Book</Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link to={AppRoute.CREATE_CATEGORY}>Add Category</Link>
                        )}
                        <Link to={AppRoute.HOME} onClick={handleLogout}>Logout</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;