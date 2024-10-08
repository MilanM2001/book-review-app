package service

import (
	"book-review-app/model"
	"book-review-app/model/dto"
	"book-review-app/repository"
)

type BookService struct {
	repo repository.BookRepository
}

func NewBookService(repo repository.BookRepository) *BookService {
	return &BookService{repo: repo}
}

func (service *BookService) FindAll() ([]model.Book, error) {
	return service.repo.FindAll()
}

func (service *BookService) FindAllPageable(page int, pageSize int) ([]model.Book, int, error) {
	return service.repo.FindAllPageable(page, pageSize)
}

func (service *BookService) FindOneByIsbn(isbn string) (*model.Book, error) {
	return service.repo.FindOneByIsbn(isbn)
}

func (service *BookService) Create(book model.Book) (*model.Book, error) {
	return service.repo.Create(book)
}

func (service *BookService) SearchBooks(term string) ([]model.Book, error) {
	return service.repo.Search(term)
}

func (service *BookService) DeleteByIsbn(isbn string) error {
	return service.repo.DeleteByIsbn(isbn)
}

func (service *BookService) UpdateBook(updateBook dto.UpdateBook, isbn string) (*model.Book, error) {
	book, err := service.FindOneByIsbn(isbn)
	if err != nil {
		return nil, err
	}

	book.Title = updateBook.Title
	book.Description = updateBook.Description
	book.Categories = updateBook.Categories

	return service.repo.UpdateBook(book)
}
