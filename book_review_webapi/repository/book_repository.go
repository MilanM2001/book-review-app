package repository

import "book-review-app/model"

type BookRepository interface {
	FindAll() ([]model.Book, error) // Changed to return a slice of books
	FindOneByIsbn(isbn string) (*model.Book, error)
	Create(book model.Book) (*model.Book, error) // Changed to return a pointer to the book
}
