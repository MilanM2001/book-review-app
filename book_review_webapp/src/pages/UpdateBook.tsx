import { useEffect, useState, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { useUpdateBook, useGetBookByIsbn } from "../hooks/bookHooks";
import { useGetAllCategories } from "../hooks/categoryHooks"; // Hook to fetch all categories
import { BookUpdate } from "../model/book";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";

const UpdateBookPage = () => {
    const { isbn } = useParams<{ isbn: string }>();
    const { book, error, loading } = useGetBookByIsbn(isbn || '');
    const { categories, loading: categoriesLoading, error: categoriesError } = useGetAllCategories(); // Fetch all categories
    const { updateBookHandler, errorMessage, loading: updateLoading } = useUpdateBook();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]); 
    const [titleError, setTitleError] = useState('');

    // Update the form with current book details
    useEffect(() => {
        if (book) {
            setTitle(book.title);
            setDescription(book.description);
            setSelectedCategories(book.categories.map((cat: any) => cat.name)); // Pre-check book's categories
        }
    }, [book]);

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitle(value);
        if (value.trim() === '') {
            setTitleError('Title cannot be empty');
        } else {
            setTitleError('');
        }
    };

    // Handle checkbox changes for categories
    const onCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setSelectedCategories((prev) =>
            checked ? [...prev, value] : prev.filter((cat) => cat !== value)
        );
    };

    const handleUpdateBookClick = () => {
        if (!title) {
            setTitleError('Title cannot be empty');
            return;
        }

        if (!titleError) {
            const updatedBook: BookUpdate = {
                title,
                description,
                categories: selectedCategories.map((name) => ({ name })), // Send categories with names
            };
            updateBookHandler(isbn || '', updatedBook);
        }
    };

    if (loading || categoriesLoading) return <div>Loading...</div>;
    if (error || categoriesError) return <Alert variant="danger">{error || categoriesError}</Alert>;

    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} md={6}>
                    <div className="update-book-container">
                        <h4 className="text-center mb-4">Update Book</h4>

                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={onChangeTitle}
                                isInvalid={!!titleError}
                            />
                            <Form.Control.Feedback type="invalid">{titleError}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="description" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        {/* Categories Checkboxes */}
                        <Form.Group controlId="categories" className="mt-3">
                            <Form.Label>Categories</Form.Label>
                            {categories.map((category) => (
                                <Form.Check
                                    key={category.name}
                                    type="checkbox"
                                    label={category.name}
                                    value={category.name}
                                    checked={selectedCategories.includes(category.name)}
                                    onChange={onCategoryChange}
                                />
                            ))}
                        </Form.Group>

                        {errorMessage && (
                            <Alert variant="danger" className="mt-2">{errorMessage}</Alert>
                        )}

                        <Button
                            className="mt-4"
                            variant="primary"
                            onClick={handleUpdateBookClick}
                            disabled={updateLoading}
                        >
                            {updateLoading ? 'Updating...' : 'Update Book'}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default UpdateBookPage;
