import { useEffect, useState, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { useUpdateBook } from "../hooks/bookHooks";
import { useGetBookByIsbn } from "../hooks/bookHooks"; 
import { BookUpdate } from "../model/book";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";

const UpdateBookPage = () => {
    const { isbn } = useParams<{ isbn: string }>();
    const { book, error, loading } = useGetBookByIsbn(isbn || '');
    const { updateBookHandler, errorMessage, loading: updateLoading } = useUpdateBook();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [titleError, setTitleError] = useState('');

    useEffect(() => {
        if (book) {
            setTitle(book.title);
            setDescription(book.description);
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

    const handleUpdateBookClick = () => {
        if (!title) {
            setTitleError('Title cannot be empty');
            return;
        }

        if (!titleError) {
            const updatedBook: BookUpdate = {
                title,
                description,
            };
            updateBookHandler(isbn || '', updatedBook);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

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
