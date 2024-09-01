package repository

import "book-review-app/model"

type ReviewRepository interface {
	FindAll() ([]model.Review, error)
	FindOneById(id uint) (*model.Review, error)
	Create(review model.Review) (*model.Review, error)
}
