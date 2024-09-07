import { Card, CardContent, CircularProgress, Container, Grid2, Link, Typography } from "@mui/material";
import { useGetAllBooks } from "../hooks/bookHooks";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css"

const HomePage: React.FC = () => {
  const { books, loading, error } = useGetAllBooks();
  const navigate = useNavigate();

  const handleBookClick = (isbn: string) => {
    navigate(`/book-details/${isbn}`);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Loading books...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error" align="center" sx={{ mt: 4 }}>
          Error loading books. Please try again later.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="main-page-container">
      <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4, mb: 4 }}>
        Books
      </Typography>
      <Grid2 container spacing={4} justifyContent="center">
        {books.map((book) => (
          <Grid2 key={book.isbn}>
            <Card className="book-card" sx={{ height: '100%' }}>
              <CardContent>
                <Link
                  variant="h6"
                  underline="hover"
                  onClick={() => handleBookClick(book.isbn)}
                  sx={{ marginBottom: '16px', textAlign: 'center', cursor: 'pointer' }}
                >
                  {book.title}
                </Link>
                <Typography variant="body2" color="textSecondary" align="center">
                  Author: {book.author}
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center">
                  Published: {new Date(book.release_date).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );

};

export default HomePage;