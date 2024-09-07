import api from "./api"

const getAllCategories = async () => {
    try {
        const response = await api.get('/categories/all')
        return response.data
    } catch (error) {
        console.error("Error in finding categories:", error)
        throw error
    }
}

export { getAllCategories }