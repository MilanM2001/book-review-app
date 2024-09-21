import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import Navbar from '../components/organisms/Navbar';
import MyAccount from '../pages/MyAccount';
import BookDetails from '../pages/BookDetails';
import CreateBookPage from '../pages/CreateBook';
import { AppRoute } from './routesEnum';
import UpdateBookPage from '../pages/UpdateBook';
import CategoriesPage from '../pages/Categories';

const AppRoutes = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path={AppRoute.LOGIN} element={<LoginPage />} />
                <Route path={AppRoute.REGISTER} element={<RegisterPage />} />
                <Route path={AppRoute.HOME} element={<HomePage />} />
                <Route path={AppRoute.BOOK_DETAILS} element={<BookDetails />} />
                <Route path={AppRoute.CREATE_BOOK} element={<CreateBookPage />} />
                <Route path={AppRoute.UPDATE_BOOK} element={<UpdateBookPage />} />
                <Route path={AppRoute.CATEGORIES} element={<CategoriesPage />} />
                <Route path={AppRoute.MY_ACCOUNT} element={<MyAccount />} />
                <Route path={AppRoute.NOT_FOUND} element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;