import { useState, ChangeEvent } from "react";
import InputFieldTS from "../components/atoms/InputFieldTS";
import { useCreateBook } from "../hooks/bookHooks";
import { BookRequest } from "../model/book";
import "../css/CreateBook.css"
import { CategoryResponse } from "../model/category";
import { useGetAllCategories } from "../hooks/categoryHooks";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

const CreateBookPage = () => {
    const [isbn, setIsbn] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [author, setAuthor] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<CategoryResponse[]>([]);

    const [isbnError, setIsbnError] = useState('');
    const [titleError, setTitleError] = useState('');
    const [authorError, setAuthorError] = useState('');
    const [emptyError, setEmptyError] = useState('');

    const { createBookHandler, errorMessage, loading } = useCreateBook();
    const { categories, loading: categoryLoading, error: categoryError } = useGetAllCategories();

    const onChangeIsbn = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setIsbn(value);
        if (value.length !== 11) {
            setIsbnError('ISBN must be 11 characters long');
        } else {
            setIsbnError('');
        }
    };

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitle(value);
        if (value.trim() === '') {
            setTitleError('Title cannot be empty');
        } else {
            setTitleError('');
        }
    };

    const onChangeAuthor = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAuthor(value);
        if (value.trim() === '') {
            setAuthorError('Author cannot be empty');
        } else {
            setAuthorError('');
        }
    };

    const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
        const categoryName = e.target.value;
        const isChecked = e.target.checked;

        setSelectedCategories(prevSelectedCategories => {
            if (isChecked) {
                // Add category
                const selectedCategory = categories.find(category => category.name === categoryName);
                return selectedCategory ? [...prevSelectedCategories, selectedCategory] : prevSelectedCategories;
            } else {
                // Remove category
                return prevSelectedCategories.filter(category => category.name !== categoryName);
            }
        });
    };

    const handleCreateBookClick = () => {
        if (!isbn || !title || !author) {
            setEmptyError('All fields are required');
            return;
        } else {
            setEmptyError('');
        }

        if (!isbnError && !titleError && !authorError) {
            const bookData: BookRequest = {
                isbn,
                title,
                description,
                image_url: imageUrl,
                author,
                release_date: new Date(releaseDate),
                categories: selectedCategories,
            };
            createBookHandler(bookData);
        }
    };

    return (
        <Container className="create-book-container">
            <Row className="justify-content-center">
                <Col xs={12} md={6}>
                    <div className="create-book-paper">
                        <h4 className="text-center mb-4">Create Book</h4>

                        <InputFieldTS
                            label="ISBN"
                            name="isbn"
                            value={isbn}
                            error={isbnError}
                            onChange={onChangeIsbn}
                        />

                        <InputFieldTS
                            label="Title"
                            name="title"
                            value={title}
                            error={titleError}
                            onChange={onChangeTitle}
                        />

                        <Form.Group controlId="description" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        <InputFieldTS
                            label="Image URL"
                            name="image_url"
                            value={imageUrl}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                        />

                        <InputFieldTS
                            label="Author"
                            name="author"
                            value={author}
                            error={authorError}
                            onChange={onChangeAuthor}
                        />

                        <Form.Group controlId="releaseDate" className="mt-3">
                            <Form.Label>Release Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={releaseDate}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setReleaseDate(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="categories" className="mt-3">
                            <Form.Label>Categories</Form.Label>
                            {categories.map((category: CategoryResponse) => (
                                <Form.Check
                                    key={category.name}
                                    type="checkbox"
                                    id={`category-${category.name}`}
                                    label={category.name}
                                    value={category.name}
                                    checked={selectedCategories.some(c => c.name === category.name)}
                                    onChange={handleCategoryChange}
                                />
                            ))}
                        </Form.Group>

                        {emptyError && (
                            <p className="text-center text-danger mt-2">{emptyError}</p>
                        )}

                        {errorMessage && (
                            <p className="text-center text-danger mt-2">{errorMessage}</p>
                        )}

                        <Button
                            className="mt-4"
                            variant="primary"
                            onClick={handleCreateBookClick}
                            disabled={loading || categoryLoading}
                        >
                            {loading ? 'Creating...' : 'Create Book'}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateBookPage;