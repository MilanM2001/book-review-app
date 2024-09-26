import { useGetAllBooksPageable, useSearchBooks } from "../hooks/bookHooks";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/HomePage.css";

const HomePage = () => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedTerm, setDebouncedTerm] = useState<string>(searchTerm);

  // Update the debounced search term after 1 second delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Use the search hook for searching books
  const { books: searchBooks, loading: searchLoading, error: searchError } = useSearchBooks(debouncedTerm);

  // If there's no search term, show paginated results
  const { books, totalPages, currentPage, setCurrentPage, loading, error } = useGetAllBooksPageable(page, pageSize);

  const handleBookClick = (isbn: string) => {
    navigate(`/book-details/${isbn}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const displayedBooks = searchTerm ? searchBooks : books;

  return (
    <div className="home-container my-5">
      <h4 className="text-center mb-4">Books</h4>

      {/* Search Input Field */}
      <div className="mb-4 text-center">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search by title, author, or category"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Handle Loading and Error for Search */}
      {searchLoading || loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="mt-4">Loading books...</h5>
        </div>
      ) : searchError || error ? (
        <div className="text-center my-5">
          <h5 className="text-danger">Error loading books. Please try again later.</h5>
        </div>
      ) : (
        <div>
          <div className="row">
            {displayedBooks.map((book) => (
              <div className="col-xs-12 col-sm-6 col-md-4 mb-4" key={book.isbn}>
                <div className="card h-100 home-book-card">
                  <img
                    src={book.image_url} // Adjust this based on how you save the image name
                    alt={book.title}
                    className="card-img-top home-book-img"
                    onClick={() => handleBookClick(book.isbn)}
                    onError={(e) => {
                      // Optional: Handle image loading error
                      e.currentTarget.src = 'public/images/no_image_available.jpg'; // Fallback to default image on error
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6
                      className="card-title text-center home-book-title"
                      onClick={() => handleBookClick(book.isbn)} // Title click redirects
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

          {/* Pagination only when not searching */}
          {!searchTerm && (
            <div className="text-center mt-4">
              <nav aria-label="Page navigation">
                <ul className="pagination">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
