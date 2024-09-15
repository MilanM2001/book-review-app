import { BookRequest, BookUpdate } from "../model/book"
import api from "./api"

const getAllBooks = async () => {
    try {
        const response = await api.get('/books/all')
        return response.data
    } catch (error) {
        console.error("Error in finding books:", error)
        throw error
    }
}

const getAllBooksPageable = async (page: number, pageSize: number) => {
    try {
        const response = await api.get(`/books/allPageable?page=${page}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        console.error("Error in finding books:", error);
        throw error;
    }
};

const getBookByIsbn = async (isbn: string) => {
    try {
        const res = await api.get(`/books/${isbn}`)
        return res.data
    } catch (error) {
        console.error("Error in finding book by ISBN:", error)
        throw error
    }
}

const createBook = async (book: BookRequest) => {
    try {
        await api.post("/books/create", book)
    } catch (error) {
        console.error("Create Book error:", error)
        throw error
    }
}

const updateBook = async (isbn: string, book: BookUpdate) => {
    try {
        await api.put(`/books/update/${isbn}`, book);
    } catch (error) {
        console.error("Update Book error:", error);
        throw error;
    }
};

const searchBooksByTerm = async (term: string) => {
    try {
        const res = await api.get(`/books/search`, { params: { term } });
        return res.data;
    } catch (error) {
        console.log("Error in finding books by term:", term);
        throw error;
    }
};

const deleteBook = async (isbn: string) => {
    try {
        await api.delete(`/books/delete/${isbn}`)
    } catch (error) {
        console.log("Error in deleting book by isbn:", isbn)
        throw error
    }
}

export { getAllBooks, getAllBooksPageable, getBookByIsbn, createBook, updateBook, searchBooksByTerm, deleteBook }