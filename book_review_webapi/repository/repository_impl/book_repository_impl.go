package repository_impl

import (
	"book-review-app/model"
	"book-review-app/repository"
	"gorm.io/gorm"
)

type BookRepositoryImpl struct {
	db *gorm.DB
}

func NewBookRepositoryImpl(db *gorm.DB) repository.BookRepository {
	return &BookRepositoryImpl{db: db}
}

func (repo *BookRepositoryImpl) FindAll() ([]model.Book, error) {
	var books []model.Book
	err := repo.db.Find(&books).Error
	if err != nil {
		return nil, err
	}

	return books, nil
}

func (repo *BookRepositoryImpl) FindOneByIsbn(isbn string) (*model.Book, error) {
	var book *model.Book
	err := repo.db.Where("isbn = ?", isbn).First(&book).Error
	if err != nil {
		return nil, err
	}

	return book, nil
}

func (repo *BookRepositoryImpl) Create(book model.Book) (*model.Book, error) {
	err := repo.db.Create(&book).Error
	if err != nil {
		return nil, err
	}

	return &book, nil
}
