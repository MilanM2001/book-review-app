import { CategoryRequest } from "../model/category"
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

const createCategory = async (category: CategoryRequest) => {
    try {
        await api.post("/categories/create", category)
    } catch (error) {
        console.error("Create category error:", error)
        throw error
    }
}

const deleteCategory = async (name: string) => {
    try {
        await api.delete(`/categories/delete/${name}`)
    } catch (error) {
        console.error("Delete category error:", error)
        throw error
    }
}

export { getAllCategories, createCategory, deleteCategory }