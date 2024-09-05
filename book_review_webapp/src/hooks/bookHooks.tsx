import { useEffect, useState } from "react"
import { getAllBooks, getBookByIsbn } from "../services/bookService"
import { BookResponse } from "../model/book";

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

const useGetBookByIsbn = () => {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const getBookByIsbnHandler = async (isbn: string) => {
        try {
            setIsLoading(true);
            const book = await getBookByIsbn(isbn);
            return book;
        } catch (error: any) {
            setError(error);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { getBookByIsbnHandler, loading, error };
};



export { useGetAllBooks, useGetBookByIsbn }