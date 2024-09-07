import { useEffect, useState } from "react"
import { createBook, getAllBooks, getBookByIsbn } from "../services/bookService"
import { BookRequest, BookResponse } from "../model/book";
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

const useGetBookByIsbn = (isbn: string) => {
    const [book, setBook] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getBookByIsbnHandler = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getBookByIsbn(isbn)
                setBook(response);
            } catch (error) {
                setError("Error in finding book by ISBN.");
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



export { useGetAllBooks, useGetBookByIsbn, useCreateBook }