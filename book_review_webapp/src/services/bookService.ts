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

export { getAllBooks, getBookByIsbn }