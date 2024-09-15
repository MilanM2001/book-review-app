import { useParams, useNavigate } from 'react-router-dom';
import { useGetBookByIsbn } from '../hooks/bookHooks';
import { Alert, Button, Card, Container, Spinner, Modal } from 'react-bootstrap';
import { useGetMe } from '../hooks/authHooks';
import { useDeleteBook } from '../hooks/bookHooks'; // Assuming useDeleteBook is placed here
import '../css/BookDetails.css';
import { useState, useEffect } from 'react';

const defaultImage = 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=';

const BookDetails = () => {
    const { isbn } = useParams<{ isbn: string }>();
    const { book, loading, error } = useGetBookByIsbn(isbn || '');
    const { getMeHandler } = useGetMe();
    const { deleteBookHandler, loading: deleteLoading, error: deleteError } = useDeleteBook();
    const navigate = useNavigate();

    const [userRole, setUserRole] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false); // State for confirmation modal

    useEffect(() => {
        // Fetch user details and set the role and authentication status
        const fetchUser = async () => {
            try {
                const userData = await getMeHandler();
                setUserRole(userData.role); // Assuming userData has a 'role' property
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
                setUserRole(null);
            }
        };

        fetchUser();
    }, [getMeHandler]);

    const handleDelete = async () => {
        if (book) {
            await deleteBookHandler(book.isbn);
            navigate('/'); // Redirect to the main page after deletion
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleUpdate = () => {
        if (book) {
            navigate(`/books/update/${book.isbn}`); // Navigate to update page
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-4">
                <Spinner animation="border" />
                <h4 className="mt-3">Loading book details...</h4>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">Error: {error}</Alert>
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
                            <Card.Subtitle className="mb-2 text-muted">
                                Author: {book.author}
                            </Card.Subtitle>
                            <Card.Text>
                                Published: {new Date(book.release_date).toLocaleDateString()}
                            </Card.Text>
                            <Card.Text>
                                ISBN: {book.isbn}
                            </Card.Text>
                            {deleteLoading ? (
                                <Spinner animation="border" />
                            ) : (
                                isAuthenticated && userRole === 'admin' && (
                                    <>
                                        <Button variant="danger" onClick={handleShowModal}>
                                            Delete Book
                                        </Button>
                                        <Button variant="primary" onClick={handleUpdate} className="ms-2">
                                            Update Book
                                        </Button>
                                    </>
                                )
                            )}
                            {deleteError && <Alert variant="danger">{deleteError}</Alert>}
                        </Card.Body>
                    </Card>

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Deletion</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to delete this book?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                Yes, Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : (
                <Alert variant="info">No book found with the given ISBN.</Alert>
            )}
        </Container>
    );
};

export default BookDetails;
