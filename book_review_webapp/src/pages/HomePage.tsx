import { useGetAllBooks, useSearchBooks } from "../hooks/bookHooks";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css"
import { useEffect, useState } from "react";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const navigate = useNavigate();

  const { books: allBooks, loading: allBooksLoading, error: allBooksError } = useGetAllBooks();
  const { books: searchedBooks, loading: searchLoading, error: searchError } = useSearchBooks(debouncedTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 1000); // 1 second debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleBookClick = (isbn: string) => {
    navigate(`/book-details/${isbn}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (allBooksLoading || searchLoading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-4">Loading books...</h5>
      </div>
    );
  }

  if (allBooksError || searchError) {
    return (
      <div className="container text-center my-5">
        <h5 className="text-danger">Error loading books. Please try again later.</h5>
      </div>
    );
  }

  const booksToDisplay = debouncedTerm ? searchedBooks : allBooks;

  return (
    <div className="container my-5">
      <h4 className="text-center mb-4">Books</h4>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search books by title or author"
        value={searchTerm}
        onChange={handleSearchChange}
        autoFocus
      />
      <div className="row">
        {booksToDisplay.map((book) => (
          <div className="col-xs-12 col-sm-6 col-md-4 mb-4" key={book.isbn}>
            <div className="card h-100 book-card">
              <img
                src={book.image_url}
                alt={book.title}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h6
                  className="card-title text-center"
                  style={{ cursor: 'pointer', marginBottom: '16px' }}
                  onClick={() => handleBookClick(book.isbn)}
                >
                  {book.title}
                </h6>
                <p className="card-text text-center text-muted">Author: {book.author}</p>
                <p className="card-text text-center text-muted">
                  Published: {new Date(book.release_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;