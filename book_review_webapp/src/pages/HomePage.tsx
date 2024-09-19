import { useGetAllBooksPageable } from "../hooks/bookHooks";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css"
import { useState } from "react";

const HomePage = () => {
  const [page, setPage] = useState(1)
  const pageSize = 5
  const navigate = useNavigate()

  const { books, totalPages, currentPage, setCurrentPage, loading, error } = useGetAllBooksPageable(page, pageSize)

  const handleBookClick = (isbn: string) => {
    navigate(`/book-details/${isbn}`)
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber)
    setCurrentPage(pageNumber)
  };

  if (loading) {
    return (
      <div className="home-container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-4">Loading books...</h5>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container text-center my-5">
        <h5 className="text-danger">Error loading books. Please try again later.</h5>
      </div>
    );
  }

  return (
    <div className="home-container my-5">
      <h4 className="text-center mb-4">Books</h4>
      <div className="row">
        {books.map((book) => (
          <div className="col-xs-12 col-sm-6 col-md-4 mb-4" key={book.isbn}>
            <div className="card h-100 home-book-card">
              <img
                src={book.image_url}
                alt={book.title}
                className="card-img-top home-book-img"
                onClick={() => handleBookClick(book.isbn)} // Image click redirects
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
    </div>
  );
};

export default HomePage;