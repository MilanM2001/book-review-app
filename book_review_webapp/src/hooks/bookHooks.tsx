import { useEffect, useState } from "react"
import { createBook, deleteBook, getAllBooks, getAllBooksPageable, getBookByIsbn, searchBooksByTerm, updateBook } from "../services/bookService"
import { BookRequest, BookResponse, BookUpdate } from "../model/book";
import { useNavigate } from "react-router-dom";

const useGetAllBooks = () => {
    const [books, setBooks] = useState<BookResponse[]>([]);
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getAllBooksHandler = async () => {
            try {
                setIsLoading(true)
                const res = await getAllBooks()
                setBooks(res)
            } catch (error: any) {
                setIsLoading(false)
                setError(error)
            } finally {
                setIsLoading(false)
            }

        }
        getAllBooksHandler()
    }, [])
    return { books, loading, error }
}

const useGetAllBooksPageable = (page: number, pageSize: number) => {
    const [books, setBooks] = useState<BookResponse[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(page);
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const getAllBooksHandler = async () => {
            try {
                setIsLoading(true);
                const res = await getAllBooksPageable(currentPage, pageSize);
                setBooks(res.books);
                setTotalPages(res.totalPages);
            } catch (error: any) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        getAllBooksHandler();
    }, [currentPage, pageSize]);

    return { books, totalPages, currentPage, setCurrentPage, loading, error };
};

const useGetBookByIsbn = (isbn: string) => {
    const [book, setBook] = useState<BookResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getBookByIsbnHandler = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getBookByIsbn(isbn)
                setBook(response);
            } catch (error: any) {
                setError(error);
                console.error("Error in finding book by ISBN:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isbn) {
            getBookByIsbnHandler();
        }
    }, [isbn]);

    return { book, loading, error };
};

const useCreateBook = () => {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const createBookHandler = async (book: BookRequest) => {
        try {
            setIsLoading(true)
            await createBook(book)
            navigate("/")
        } catch (error: any) {
            if (error.response && error.response.status == 409) {
                setErrorMessage("ISBN already taken")
            }
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return { createBookHandler, loading, error, errorMessage }
}

export const useUpdateBook = () => {
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const updateBookHandler = async (isbn: string, book: BookUpdate) => {
        try {
            setIsLoading(true);
            await updateBook(isbn, book);
            navigate("/");
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                setErrorMessage("Error: Book cannot be updated.");
            }
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { updateBookHandler, loading, error, errorMessage };
};

const useSearchBooks = (term: string) => {
    const [books, setBooks] = useState<BookResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await searchBooksByTerm(term);
                setBooks(result);
            } catch (error) {
                setError("Failed to fetch books");
            } finally {
                setLoading(false);
            }
        };

        if (term) {
            fetchBooks();
        } else {
            setBooks([]);
        }
    }, [term]);

    return { books, loading, error };
};


const useDeleteBook = () => {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const deleteBookHandler = async (isbn: string) => {
        try {
            setIsLoading(true)
            await deleteBook(isbn)
            navigate("/")
        } catch (error: any) {
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return { deleteBookHandler, loading, error }
}



export { useGetAllBooks, useGetAllBooksPageable, useGetBookByIsbn, useCreateBook, useSearchBooks, useDeleteBook }