import { useEffect, useState } from "react"
import { CategoryResponse } from "../model/category"
import { getAllCategories } from "../services/categoryService"

const useGetAllCategories = () => {
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getAllCategoriesHandler = async () => {
            try {
                setIsLoading(true)
                const res = await getAllCategories()
                setCategories(res)
            } catch (error: any) {
                setIsLoading(false)
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }
        getAllCategoriesHandler()
    }, [])
    return { categories, loading, error }
}

export { useGetAllCategories }