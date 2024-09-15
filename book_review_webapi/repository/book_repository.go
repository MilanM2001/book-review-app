package repository

import "book-review-app/model"

type BookRepository interface {
	FindAll() ([]model.Book, error)
	FindAllPageable(page int, pageSize int) ([]model.Book, int, error)
	FindOneByIsbn(isbn string) (*model.Book, error)
	Create(book model.Book) (*model.Book, error)
	Search(term string) ([]model.Book, error)
	DeleteByIsbn(isbn string) error
	UpdateBook(book *model.Book) (*model.Book, error)
}
