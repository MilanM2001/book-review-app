import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import Navbar from '../components/organisms/Navbar';
import MyAccount from '../pages/MyAccount';
import BookDetails from '../pages/BookDetails';
import CreateBookPage from '../pages/CreateBook';

const AppRoutes = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path='/' element={<HomePage />} />
                <Route path='/book-details/:isbn' element={<BookDetails />} />
                <Route path='/create-book' element={<CreateBookPage />} />
                <Route path='/my-account' element={<MyAccount />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;