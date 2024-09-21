import { useEffect, useState } from "react"
import { CategoryRequest, CategoryResponse } from "../model/category"
import { createCategory, deleteCategory, getAllCategories } from "../services/categoryService"

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
    return { categories, setCategories, loading, error }
}

const useCreateCategory = () => {
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createCategoryHandler = async (category: CategoryRequest) => {
        try {
            setIsLoading(true);
            await createCategory(category);
        } catch (err) {
            setError("Failed to create review");
        } finally {
            setIsLoading(false);
        }
    };

    return { createCategoryHandler, loading, error };
};

const useDeleteCategory = () => {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const deleteCategoryHandler = async (name: string) => {
        try {
            setIsLoading(true)
            await deleteCategory(name)
        } catch (error) {
            setError("Failed to delete review")
        } finally {
            setIsLoading(false)
        }
    }

    return { deleteCategoryHandler, loading, error }
}

export { useGetAllCategories, useCreateCategory, useDeleteCategory }