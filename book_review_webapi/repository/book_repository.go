package repository

import "book-review-app/model"

type BookRepository interface {
	FindAll() ([]model.Book, error)
	FindOneByIsbn(isbn string) (*model.Book, error)
	Create(book model.Book) (*model.Book, error)
	Search(term string) ([]model.Book, error)
}
