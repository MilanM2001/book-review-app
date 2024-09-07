import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Alert, Card, CardContent } from '@mui/material';
import { useGetBookByIsbn } from '../hooks/bookHooks';

const BookDetails = () => {
    const { isbn } = useParams<{ isbn: string }>(); // Get the ISBN from the URL
    const { book, loading, error } = useGetBookByIsbn(isbn || '');

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {book ? (
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            {book.title}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Author: {book.author}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" textAlign="center">
                            Published: {new Date(book.release_date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" textAlign="center">
                            ISBN: {book.isbn}
                        </Typography>
                        {/* Add more details as needed */}
                    </CardContent>
                </Card>
            ) : (
                <Alert severity="info">No book found with the given ISBN.</Alert>
            )}
        </Container>
    );
};

export default BookDetails;