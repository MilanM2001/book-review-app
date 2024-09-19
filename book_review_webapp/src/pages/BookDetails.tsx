import { useParams, useNavigate } from 'react-router-dom';
import { useGetBookByIsbn, useDeleteBook, useUpdateBook } from '../hooks/bookHooks';
import { Alert, Button, Card, Container, Spinner, Form } from 'react-bootstrap';
import '../css/BookDetails.css';
import { useState } from 'react';
import { useCreateReview, useGetReviewsByBookIsbn } from '../hooks/reviewHooks';
import { useAuth } from '../services/authContext'; // Import useAuth

const defaultImage = 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=';

const BookDetails = () => {
    const { isbn } = useParams<{ isbn: string }>();
    const { book, loading, error } = useGetBookByIsbn(isbn || '');
    const { role, isAuthenticated } = useAuth(); // Get role and authentication status
    const { reviews, loading: reviewsLoading, error: reviewsError } = useGetReviewsByBookIsbn(isbn || '');
    const { createReviewHandler, loading: createReviewLoading, error: createReviewError } = useCreateReview();
    const { deleteBookHandler } = useDeleteBook();
    const { updateBookHandler } = useUpdateBook();
    const navigate = useNavigate();

    const [review, setReview] = useState({ title: '', text: '', rating: 0, book_isbn: isbn || '', username: '' });
    const [validated, setValidated] = useState(false);

    const handleDelete = async () => {
        await deleteBookHandler(book.isbn);
        navigate('/books');
    };

    const handleUpdate = async () => {
        navigate(`/update-book/${book.isbn}`);
    };

    console.log(role)

    const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidated(true);
        if (review.title && review.text && review.rating > 0) {
            await createReviewHandler(review);
            setReview({ ...review, title: '', text: '', rating: 0 });
        }
    };

    if (loading || reviewsLoading) {
        return (
            <Container className="text-center mt-4">
                <Spinner animation="border" />
                <h4 className="mt-3">Loading book details...</h4>
            </Container>
        );
    }

    if (error || reviewsError) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">Error: {error || reviewsError}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            {book ? (
                <>
                    <Card className="book-card">
                        <Card.Img
                            variant="top"
                            src={book.image_url || defaultImage}
                            alt={book.title}
                            className="book-image"
                        />
                        <Card.Body>
                            <Card.Title className="book-title">{book.title}</Card.Title>
                            <Card.Subtitle className="book-isbn">ISBN: {book.isbn}</Card.Subtitle>
                            <Card.Text className="book-description">{book.description}</Card.Text>

                            {/* Show buttons only if the user is an admin */}
                            {role === 'admin' && isAuthenticated && (
                                <div className="d-flex justify-content-end">
                                    <Button variant="warning" className="me-2" onClick={handleUpdate}>
                                        Update
                                    </Button>
                                    <Button variant="danger" onClick={handleDelete}>
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Show the review form only if the user is authenticated */}
                    {isAuthenticated && (
                        <Form noValidate validated={validated} onSubmit={handleReviewSubmit} className="mt-4 review-form">
                            <h5>Write a Review</h5>
                            <Form.Group controlId="reviewTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter review title"
                                    value={review.title}
                                    onChange={(e) => setReview({ ...review, title: e.target.value })}
                                />
                                <Form.Control.Feedback type="invalid">Title is required</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="reviewText" className="mt-2">
                                <Form.Label>Review</Form.Label>
                                <Form.Control
                                    required
                                    as="textarea"
                                    rows={3}
                                    placeholder="Write your review"
                                    value={review.text}
                                    onChange={(e) => setReview({ ...review, text: e.target.value })}
                                />
                                <Form.Control.Feedback type="invalid">Review text is required</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="reviewRating" className="mt-2">
                                <Form.Label>Rating</Form.Label>
                                <Form.Control
                                    required
                                    type="number"
                                    min={1}
                                    max={5}
                                    placeholder="Rate from 1 to 5"
                                    value={review.rating}
                                    onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                                />
                                <Form.Control.Feedback type="invalid">Rating is required and must be between 1 and 5</Form.Control.Feedback>
                            </Form.Group>
                            <Button className="mt-3" type="submit" disabled={createReviewLoading}>
                                Submit Review
                            </Button>
                            {createReviewError && (
                                <Alert className="mt-2" variant="danger">
                                    Error creating review: {createReviewError}
                                </Alert>
                            )}
                        </Form>
                    )}

                    <h5 className="mt-4">Reviews</h5>
                    {reviews && reviews.length > 0 ? (
                        reviews.map((rev: any) => (
                            <Card key={rev.id} className="review-card mt-3">
                                <Card.Body>
                                    <Card.Title>{rev.title}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Rating: {rev.rating} | By: {rev.username}
                                    </Card.Subtitle>
                                    <Card.Text>{rev.text}</Card.Text>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>No reviews yet. Be the first to review this book!</p>
                    )}
                </>
            ) : (
                <Alert variant="danger">Book not found!</Alert>
            )}
        </Container>
    );
};

export default BookDetails;
