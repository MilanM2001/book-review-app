import { useParams } from 'react-router-dom';
import { useGetBookByIsbn } from '../hooks/bookHooks';
import { Alert, Card, Container, Spinner } from 'react-bootstrap';
import '../css/BookDetails.css'

const defaultImage = 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=';

const BookDetails = () => {
    const { isbn } = useParams<{ isbn: string }>();
    const { book, loading, error } = useGetBookByIsbn(isbn || '');

    if (loading) {
        return (
            <Container className="text-center mt-4">
                <Spinner animation="border" />
                <h4 className="mt-3">
                    Loading book details...
                </h4>
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
                        {/* Add more details as needed */}
                    </Card.Body>
                </Card>
            ) : (
                <Alert variant="info">No book found with the given ISBN.</Alert>
            )}
        </Container>
    );
};

export default BookDetails;