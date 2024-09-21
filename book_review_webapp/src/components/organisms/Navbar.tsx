import { Link, useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks/authHooks';
import { AppRoute } from '../../routing/routesEnum';
import { useAuth } from '../../services/authContext';
import '../../css/Navbar.css'

const Navbar = () => {
    const navigate = useNavigate();
    const { logoutHandler } = useLogout();
    const { role, isAuthenticated } = useAuth(); // Get role and authentication status

    const handleLogout = async () => {
        await logoutHandler();
        navigate(AppRoute.LOGIN); // Redirect to login after logout
    };

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/">Main Page</Link>
                {!isAuthenticated ? (
                    <>
                        <Link to={AppRoute.LOGIN}>Login</Link>
                        <Link to={AppRoute.REGISTER}>Register</Link>
                    </>
                ) : (
                    <>
                        <Link to={AppRoute.MY_ACCOUNT}>My Account</Link>
                        {role === 'admin' && (
                            <>
                                <Link to={AppRoute.CREATE_BOOK}>Add Book</Link>
                                <Link to={AppRoute.CATEGORIES}>Categories</Link>
                            </>
                        )}
                        <Link to={AppRoute.HOME} onClick={handleLogout}>Logout</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
