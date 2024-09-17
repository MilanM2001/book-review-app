package repository

import "book-review-app/model"

type ReviewRepository interface {
	FindAll() ([]model.Review, error)
	FindOneById(id uint) (*model.Review, error)
	FindByUsername(username string) ([]model.Review, error)
	FindByBookIsbn(bookIsbn string) ([]model.Review, error)
	Create(review model.Review) (*model.Review, error)
}
