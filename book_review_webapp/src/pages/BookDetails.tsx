import { useParams, useNavigate } from 'react-router-dom';
import { useGetBookByIsbn } from '../hooks/bookHooks';
import { Alert, Button, Card, Container, Spinner, Modal, Form } from 'react-bootstrap';
import { useGetMe } from '../hooks/authHooks';
import { useDeleteBook } from '../hooks/bookHooks'; // Assuming useDeleteBook is placed here
import '../css/BookDetails.css';
import { useState, useEffect } from 'react';
import { useCreateReview, useGetReviewsByBookIsbn } from '../hooks/reviewHooks';

const defaultImage = 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=';

const BookDetails = () => {
    const { isbn } = useParams<{ isbn: string }>();
    const { book, loading, error } = useGetBookByIsbn(isbn || '');
    const { getMeHandler } = useGetMe();
    const { reviews, loading: reviewsLoading, error: reviewsError } = useGetReviewsByBookIsbn(isbn || '');
    const { createReviewHandler, loading: createReviewLoading, error: createReviewError } = useCreateReview();
    const navigate = useNavigate();

    const [review, setReview] = useState({ title: '', text: '', rating: 0, book_isbn: isbn || '', username: '' });
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [validated, setValidated] = useState(false);
    const token = localStorage.getItem("accessToken");

    if (token) {
        const fetchUser = async () => {
            try {
                const userData = await getMeHandler();
                setUserRole(userData.role);
                setIsAuthenticated(true);
                setReview({ ...review, username: userData.username });

            } catch (error) {
                setIsAuthenticated(false);
                setUserRole(null);
            }
        };
        fetchUser();
    }


    const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidated(true);
        if (review.title && review.text && review.rating) {
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
                            <Card.Title>{book.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Author: {book.author}</Card.Subtitle>
                            <Card.Text>{book.description}</Card.Text>
                            <Card.Text>ISBN: {book.isbn}</Card.Text>
                        </Card.Body>
                    </Card>

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
                        </Form.Group>
                        <Button className="mt-3" type="submit" disabled={createReviewLoading}>
                            Submit Review
                        </Button>
                        {createReviewError && <Alert className="mt-2" variant="danger">Error creating review: {createReviewError}</Alert>}
                    </Form>

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
