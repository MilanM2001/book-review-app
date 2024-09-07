import { BookRequest } from "../model/book"
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

const getBookByIsbn = async (isbn: string) => {
    try {
        const response = await api.get(`/books/${isbn}`)
        return response.data
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

export { getAllBooks, getBookByIsbn, createBook }