import React, { useState } from 'react';
import { useGetAllCategories, useCreateCategory, useDeleteCategory } from '../hooks/categoryHooks';
import "../css/Categories.css"

const CategoriesPage: React.FC = () => {
    const { categories, loading: categoriesLoading, error: categoriesError, setCategories } = useGetAllCategories(); // Added setCategories
    const { createCategoryHandler, loading: createLoading } = useCreateCategory();
    const { deleteCategoryHandler, loading: deleteLoading, error: deleteError } = useDeleteCategory();

    const [newCategory, setNewCategory] = useState<string>('');
    const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);

    const isDuplicate = (name: string) => categories.some(category => category.name.toLowerCase() === name.toLowerCase());
    const isValidCategoryName = (name: string) => name.length > 2;

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidCategoryName(newCategory)) {
            setCreateErrorMessage('Category name must be at least 3 characters long');
            return;
        }

        if (isDuplicate(newCategory)) {
            setCreateErrorMessage('Category already exists');
            return;
        }

        try {
            await createCategoryHandler({ name: newCategory });
            setCategories((prevCategories) => [...prevCategories, { name: newCategory }]);
            setNewCategory('');
            setCreateErrorMessage(null);
        } catch (err: any) {
            if (err.response?.status === 409) {
                setCreateErrorMessage('Category already exists');
            } else {
                setCreateErrorMessage('Error creating category');
            }
        }
    };

    const handleDeleteCategory = async (name: string) => {
        const confirmed = window.confirm(`Are you sure you want to delete the category "${name}"?`);
        if (confirmed) {
            await deleteCategoryHandler(name);
            setCategories((prevCategories) => prevCategories.filter((category) => category.name !== name));
        }
    };

    return (
        <div className="categories-page">
            <h1>Categories</h1>

            {/* Form to add a new category */}
            <form onSubmit={handleCreateCategory} className="category-form">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category name"
                    required
                />
                <button type="submit" disabled={createLoading}>
                    {createLoading ? 'Adding...' : 'Add Category'}
                </button>
            </form>

            {/* Display error message for category creation */}
            {createErrorMessage && <div className="error">{createErrorMessage}</div>}

            {/* Display list of categories */}
            {categoriesLoading ? (
                <p>Loading categories...</p>
            ) : categoriesError ? (
                <p className="error">Failed to load categories: {categoriesError}</p>
            ) : (
                <ul className="category-list">
                    {categories.map((category) => (
                        <li key={category.name}>
                            {category.name}
                            <button
                                onClick={() => handleDeleteCategory(category.name)}
                                disabled={deleteLoading}
                                className="delete-btn"
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Display error message for deletion */}
            {deleteError && <div className="error">Error deleting category: {deleteError}</div>}
        </div>
    );
};

export default CategoriesPage;
