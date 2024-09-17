export enum AppRoute {
    HOME = '/',
    LOGIN = '/login',
    REGISTER = '/register',
    BOOK_DETAILS = '/book-details/:isbn',
    CREATE_BOOK = '/create-book',
    CREATE_CATEGORY = '/create-category',
    UPDATE_BOOK = '/books/update/:isbn',
    MY_ACCOUNT = '/my-account',
    NOT_FOUND = '*',
}