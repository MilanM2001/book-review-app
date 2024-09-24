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
	err := repo.db.Preload("Categories").Find(&books).Error
	if err != nil {
		return nil, err
	}

	return books, nil
}

func (repo *BookRepositoryImpl) FindAllPageable(page int, pageSize int) ([]model.Book, int, error) {
	var books []model.Book
	var totalCount int64

	// Count total records
	if err := repo.db.Model(&model.Book{}).Count(&totalCount).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	err := repo.db.Preload("Categories").Offset(int(offset)).Limit(pageSize).Find(&books).Error
	if err != nil {
		return nil, 0, err
	}

	totalPages := int(totalCount) / pageSize
	if totalCount%int64(pageSize) > 0 {
		totalPages++
	}

	return books, totalPages, nil
}

func (repo *BookRepositoryImpl) FindOneByIsbn(isbn string) (*model.Book, error) {
	var book *model.Book
	err := repo.db.Preload("Categories").Where("isbn = ?", isbn).First(&book).Error
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

func (repo *BookRepositoryImpl) Search(term string) ([]model.Book, error) {
	var books []model.Book

	// Join the books and categories tables and search by title, author, or category name
	err := repo.db.Joins("JOIN book_categories bc ON bc.book_isbn = books.isbn").
		Joins("JOIN categories c ON c.name = bc.category_name").
		Where("books.title ILIKE ? OR books.author ILIKE ? OR c.name ILIKE ?", "%"+term+"%", "%"+term+"%", "%"+term+"%").
		Find(&books).Error

	if err != nil {
		return nil, err
	}
	return books, nil
}

func (repo *BookRepositoryImpl) DeleteByIsbn(isbn string) error {
	err := repo.db.Exec("DELETE FROM book_categories WHERE book_isbn = ?", isbn).Error
	if err != nil {
		return err
	}

	var book model.Book
	err = repo.db.Where("isbn = ?", isbn).Delete(&book).Error
	if err != nil {
		return err
	}

	return nil
}

func (repo *BookRepositoryImpl) UpdateBook(book *model.Book) (*model.Book, error) {
	tx := repo.db.Begin()

	err := tx.Model(&book).Select("Title", "Description").Updates(book).Error
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	err = tx.Model(&book).Association("Categories").Replace(book.Categories)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	tx.Commit()

	return book, nil
}
