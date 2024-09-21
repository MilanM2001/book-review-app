export enum AppRoute {
    HOME = '/',
    LOGIN = '/login',
    REGISTER = '/register',
    BOOK_DETAILS = '/book-details/:isbn',
    CREATE_BOOK = '/create-book',
    CATEGORIES = '/categories',
    UPDATE_BOOK = '/update-book/:isbn',
    MY_ACCOUNT = '/my-account',
    NOT_FOUND = '*',
}